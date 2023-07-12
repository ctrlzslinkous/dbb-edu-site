import {compileMDX} from 'next-mdx-remote/rsc'
import { stringify } from 'querystring'
import rehypeHighlight from 'rehype-highlight/lib'
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta'
import sectionParent from '@agentofuser/rehype-section'
import rehypeRewrite from 'rehype-rewrite'
import { ReactComponentElement } from 'react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings/lib'
import numberElements from './numberElements'

const section = (sectionParent as any).default

type Filetree = {
    "tree" : [
        {
            "path": string,
        }
    ]
}

export async function getLessonByName(fileName: string): Promise<Lesson | undefined> {
    const res = await fetch(`https://raw.githubusercontent.com/ctrlzslinkous/lms-content/main/${fileName}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
            cache: "no-cache",
        },
    }, )
    if(!res.ok) return undefined

    const rawMDX = await res.text()

    if(rawMDX === '404: Not Found') return undefined
    
    const {frontmatter, content} = await compileMDX<{title: string, date: string, tags: string[]}>({
     source: rawMDX,
     components: {},
     options: {
        parseFrontmatter: true,
        mdxOptions: {
            rehypePlugins: [
                // rehypeHighlight,
                // rehypeInferReadingTimeMeta,
                section,
                [numberElements, {tagNames: ["h3"], numberPunctuation: ": ", prefixNumbers: true}]
            ],
        },
     }
    })

    const id = fileName.replace(/\.mdx$/, '')
    const lessonObj: Lesson = {meta: {id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags}, content}
    return lessonObj
}

export async function getLessonsMeta(): Promise<LessonMeta[] | undefined>{
    const res = await fetch('https://api.github.com/repos/ctrlzslinkous/lms-content/git/trees/main?recursive=1', {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    if(!res.ok) return undefined
    
    const repoFiletree: Filetree = await res.json()

    const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'))

    const lessons: LessonMeta[] = []

    for(const file of filesArray){
        const lesson = await getLessonByName(file)
        if(lesson){
            const { meta } = lesson
            lessons.push(meta)
        }
    }
    return lessons
}
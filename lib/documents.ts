import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight/lib'
import sectionParent from '@agentofuser/rehype-section'
import numberElements from './numberElements'

const section = (sectionParent as any).default

type Filetree = {
    "tree" : [
        {
            "path": string,
        }
    ]
}

export async function getPathByID(docId: string){
    const documents = await getDocumentsMeta("any")

    if (!documents) return
    for(let doc of documents){
        if(doc.id == docId){
            return doc.path
        }
    }
}

export async function getDocumentByPath(filePath: string): Promise<Lesson | undefined> {
    console.log("file path in getDocumentByPath", filePath)
    const res = await fetch(`https://raw.githubusercontent.com/ctrlzslinkous/lms-content/main/${filePath}`, {
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
    
    const {frontmatter, content} = await compileMDX<{id: string, title: string, date: string, tags: string[], course: string, docType: string}>({
     source: rawMDX,
     components: {},
     options: {
        parseFrontmatter: true,
        mdxOptions: {
            rehypePlugins: [
                rehypeHighlight,
                // rehypeInferReadingTimeMeta,
                section,
                [numberElements, {tagNames: ["h3"], numberPunctuation: ". ", prefixNumbers: true}]
            ],
        },
     }
    })

    const path = filePath.replace(/\.mdx$/, '')
    
    const lessonObj: Lesson = {meta: {path, id:frontmatter.id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags, course: frontmatter.course, type: frontmatter.docType}, content}
    console.log("lesson object path", lessonObj.meta.path)
    return lessonObj
}

export async function getDocumentsMeta(docType: "lesson" | "course" | "reference" | "tutorial" | "article" | "any"): Promise<DocumentMeta[] | undefined>{
    const res = await fetch('https://api.github.com/repos/ctrlzslinkous/lms-content/git/trees/main?recursive=1', {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
        },
        cache: 'no-store'
    })

    if(!res.ok) return undefined
    
    const repoFiletree: Filetree = await res.json()

    const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'))

    const documents: DocumentMeta[] = []
    //TODO: Select by document type
    for(const file of filesArray){
        const document = await getDocumentByPath(file)

        if(document){
            const { meta } = document
            if(meta.type == docType || docType == "any"){
                documents.push(meta)
            }
            
        }
    }
    return documents
}
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

export async function getDocumentsMeta(): Promise<DocumentMeta[] | undefined>{
    const res = await fetch('https://api.github.com/repos/ctrlzslinkous/lms-content/git/trees/main?recursive=1', {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
        },
        cache: 'no-store' // TODO: remove
    })

    if(!res.ok) return undefined
    
    const repoFiletree: Filetree = await res.json()
    const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'))
    const documents: DocumentMeta[] = []

    for(const file of filesArray){
        const document = await getLessonByPath(file) //TODO: Parsing by doc type? 
        if(document){
            const { meta } = document
            documents.push(meta)
        }
    }
    return documents
}

export async function getPathByID(docId: string){
    const documents = await getDocumentsMeta()

    if (!documents) return
    for(let doc of documents){
        if(doc.id == docId){
            return doc.path
        }
    }
}

export async function getLessonByPath(filePath: string): Promise<Lesson | undefined> {
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

    const path = filePath
    const date = new Date(frontmatter.date)

    const lessonObj: Lesson = {meta: {path, id:frontmatter.id, title: frontmatter.title, date: date, tags: frontmatter.tags, course: frontmatter.course, type: frontmatter.docType}, content}
    console.log("lesson object path", lessonObj.meta.path)
    return lessonObj
}

export async function getRawMDXByPath(filePath: string): Promise<string | undefined> {
    console.log("filePath in getRawMDX", filePath)
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
    return rawMDX
}

export async function createLessonFromRawMDX(rawMDX: string): Promise<Lesson>{
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
       const date = new Date(frontmatter.date)
       const filePath = await getPathByID(frontmatter.id)
       const lessonObj: Lesson = {meta: {path: filePath!, id:frontmatter.id, title: frontmatter.title, date: date, tags: frontmatter.tags, course: frontmatter.course, type: frontmatter.docType}, content}
       return lessonObj

}



export async function getCourseById(courseId: string){
    const path = await getPathByID(courseId)
    if (!path) return console.warn("Could not find path for " + courseId) //this should happen in getPath...
    const courseMDX = await getRawMDXByPath(path)
    if(!courseMDX) return console.warn("No markdown for ", courseId)
    const {frontmatter, content} = await compileMDX<CourseMeta>({
        source: courseMDX!,
        components: {},
        options: {
           parseFrontmatter: true,
           mdxOptions: {
               rehypePlugins: [],
           },
        }
       })
       
       const lessons: Lesson[] = []
       console.log(frontmatter)
       for(let id of frontmatter.lessonIds){
          const lessonPath = await getPathByID(id)
          const lessonMDX = await getRawMDXByPath(lessonPath!)
          const lesson = await createLessonFromRawMDX(lessonMDX!)
          lessons.push(lesson)
       }
       const date = new Date(frontmatter.date)
       const courseObj: Course = {meta: {path: path, id:frontmatter.id, title: frontmatter.title, date: date, tags: frontmatter.tags, type: frontmatter.docType, lessonIds: frontmatter.lessonIDs}, content, lessons}
       return courseObj

}
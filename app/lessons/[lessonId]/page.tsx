import { getDocumentsMeta, getPathByID, getDocumentByPath } from "@/lib/documents";
import { notFound } from "next/navigation"
import Link from "next/link"
import '@picocss/pico'
import 'app/styles/lesson.css'
import ProjectFrame from "@/app/components/project_frame";


type Props = {
    params: {
        lessonId: string
    }
}

export async function generateParams(){ 
    const lessons = await getDocumentsMeta("lesson")

    if (!lessons) return []

    return lessons.map((lesson)=>(
        {path: lesson.path}
    ))
    
}

export async function generateMetadata({params: {lessonId}}: Props){
    const path = await getPathByID(lessonId)
    const lesson = await getDocumentByPath(`${path}.mdx`)

    if(!lesson){
        return {
            title: 'Lesson Not Found'
        }
    }

    return {
        title: lesson.meta.title,
    }
}

function nextStep(){
    return undefined
}

export default async function Lesson({params: {lessonId}}: Props){

    const path = await getPathByID(lessonId)
    const lesson = await getDocumentByPath(`${path}.mdx`)
    

    if(!lesson) return notFound()

    const {meta, content} = lesson

    return (
        <>
            <h2>{meta.title}</h2>
            <div className="grid">
                <div>
                    <article>
                        {content}
                    </article>
                </div>
                <div>
                    <ProjectFrame/>
                </div>
            </div>
            <section>
                <h4>Related:</h4>
                {/* <span>{tags}</span> */}
            </section>
            <p>
                <Link href="/">Home</Link>
            </p>
        </>
    )
    
        
}
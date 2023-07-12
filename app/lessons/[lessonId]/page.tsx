import { getLessonsMeta, getLessonByName } from "@/lib/lessons";
import { notFound } from "next/navigation"
import Link from "next/link"
import 'app/styles/lesson.css'


type Props = {
    params: {
        lessonId: string
    }
}

//TODO: kinda wish we didn't have to do this
export async function generateParams(){ 
    const lessons = await getLessonsMeta()

    if (!lessons) return []

    return lessons.map((lesson)=>(
        {lessonId: lesson.id}
    ))
}

export async function generateMetadata({params: {lessonId}}: Props){
    const lesson = await getLessonByName(`${lessonId}.mdx`)

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
    const lesson = await getLessonByName(`${lessonId}.mdx`)

    if(!lesson) return notFound()

    const {meta, content} = lesson

    console.log(content)

    const date = meta.date
    // console.log(meta.tags)

    // const tags = meta.tags.map((tag, i)=> (
    //     <Link key={i} href={`/tags/${tag}`}>{tag}</Link>
    // ))

    return (
        <>
            <h2>{meta.title}</h2>
            <p>{date}</p>
            <article>
                {content}
            </article>
            {/* <nav className="grid">
                <button onClick={nextStep()}>&lt;</button>
                <button onClick={nextStep()}>*</button>
                <button onClick={nextStep()}>&gt;</button>
            </nav> */}
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
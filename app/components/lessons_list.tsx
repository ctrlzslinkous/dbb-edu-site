import { getDocumentsMeta } from "@/lib/documents";
import LessonListItem from "./lesson_list_item";

export default async function LessonList(){
    const lessons = await getDocumentsMeta("lesson")

    if(!lessons){
        return <p>No lessons</p>
    }

    return(
        <section>
            <h2>Lessons</h2>
            <ul>
                {lessons.map((lesson: DocumentMeta)=> (
                    <LessonListItem key={lesson.id} lesson={lesson} />
                ))}
            </ul>
        </section>
    )
}
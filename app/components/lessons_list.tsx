import LessonListItem from "./lesson_list_item";

export default async function LessonList(params: {lessons: Lesson[]}){
//used to just pull them all here, but now we need to get course-specific ones
    const {lessons} = params
    if(!lessons){
        return <p>No lessons</p>
    }

    return(
        <section>
            <h2>Lessons</h2>
            <ul>
                {lessons.map((lesson)=> (
                    <LessonListItem key={lesson.meta.id} lesson={lesson.meta} />
                ))}
            </ul>
        </section>
    )
}
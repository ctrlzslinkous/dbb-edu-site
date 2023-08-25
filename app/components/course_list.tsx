import { getDocumentsMeta } from "@/lib/documents"
import Link from "next/link"

export default async function CourseList(){

    const docs = await getDocumentsMeta()
    if(!docs){
        return(<p>No documents</p>)
    }
    const courses = docs!.filter((document)=>document.type == "course")

    if(!courses){
        return <p>No courses</p>
    }

    return(
        <>
            <h2>Courses</h2>
            <ul>
                {courses.sort((a,b)=>a.date.valueOf() - b.date.valueOf()).map((course)=> (
                    <li><Link href={`/courses/${course.id}`}>{course.title}</Link></li>
                ))}
            </ul>
        </>
    )
}
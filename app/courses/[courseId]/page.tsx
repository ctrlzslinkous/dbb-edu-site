import { getCourseById } from "@/lib/documents"
import LessonList from "@/app/components/lessons_list"




type Props = {
  params: {
      courseId: string
  }
}

export default async function CoursePage({params: {courseId}}: Props){
  
  const course = await getCourseById(courseId)
  if(!course){
    return (<div>No course found for {courseId}</div>)
  }

  return (
    <div>
      <h1>{course.meta.title}</h1>
      <LessonList lessons={course.lessons}></LessonList>
    </div>
  )
}
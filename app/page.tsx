import CourseList from "./components/course_list"

export const revalidate = 0

export default function Home(){
  return (
    <div>
      <CourseList />
    </div>
  )
}
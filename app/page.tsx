import LessonList from "./components/lessons_list";

export const revalidate = 0

export default function Home(){
  return (
    <div>
      <LessonList />
    </div>
  )
}
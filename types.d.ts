type DocumentMeta = {
    path: string
    id: string,
    title: string,
    date: Date,
    tags: string[],
    type: string
}

type LessonMeta = DocumentMeta & {course: string}
type CourseMeta = DocumentsMeta & {lessonIds: string[]}

type Lesson = {
    meta: LessonMeta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}

type Course = {
    meta: CourseMeta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
    lessons: Lesson[],
}
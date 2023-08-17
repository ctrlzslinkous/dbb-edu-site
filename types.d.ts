type LessonMeta = {
    path: string
    id: string,
    title: string,
    date: string,
    tags: string[],
    course: string
}

type Lesson = {
    meta: LessonMeta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
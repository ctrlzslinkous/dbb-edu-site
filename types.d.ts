type DocumentMeta = {
    path: string
    id: string,
    title: string,
    date: string,
    tags: string[],
    type: string
}

type LessonMeta = DocumentMeta & {course: string}

type Lesson = {
    meta: LessonMeta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
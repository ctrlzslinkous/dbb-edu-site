type LessonMeta = {
    id: string,
    title: string,
    date: string,
    tags: string[],
}

type Lesson = {
    meta: LessonMeta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
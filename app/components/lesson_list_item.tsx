import Link from "next/link";
import { getLessonsMeta } from "@/lib/lessons";

type Props = {
    lesson: LessonMeta
}

export default async function LessonListItem({lesson}: Props){
    const {id, title, date} = lesson

    return (
        <li>
            <Link href={`/lessons/${id}`}>{title}</Link>
            <br />
            <p>{date}</p>
        </li>
    )
}
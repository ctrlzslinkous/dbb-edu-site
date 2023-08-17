import Link from "next/link";
import { getDocumentsMeta } from "@/lib/documents";

type Props = {
    lesson: LessonMeta
}

export default async function LessonListItem({lesson}: Props){
    const {id, title, date} = lesson

    return (
        <li>
            <Link href={`/lessons/${id}`}>{title}</Link>
            <br />
        </li>
    )
}
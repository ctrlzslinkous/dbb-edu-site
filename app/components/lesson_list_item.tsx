import Link from "next/link";
import { getDocumentsMeta } from "@/lib/documents";

type Props = {
    lesson: DocumentMeta
}

export default async function LessonListItem({lesson}: Props){
    const {id, title} = lesson

    return (
        <li>
            <Link href={`/${id}`}>{title}</Link>
            <br />
        </li>
    )
}
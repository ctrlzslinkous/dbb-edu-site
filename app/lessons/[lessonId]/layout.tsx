import 'app/styles/lesson.css'
import Link from 'next/link'

export default function LessonLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
            {children}
            <p>
                <Link href="/">Home</Link>
            </p>
        </>
    )
  }
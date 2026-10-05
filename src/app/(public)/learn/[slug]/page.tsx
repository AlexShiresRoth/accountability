import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNotice } from "@/components/notice";
import { ScenarioExercise } from "@/components/scenario";
import { getLesson, lessons } from "@/content/lessons";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  if (!lesson) return {};
  // Draft lessons stay out of search until editorial review is complete.
  return pageMetadata({ title: lesson.title, description: lesson.summary, path: `/learn/${lesson.slug}`, noindex: lesson.status !== "reviewed" });
}

export default async function LessonPage({ params }: PageProps<"/learn/[slug]">) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();

  const index = lessons.indexOf(lesson);
  const next = lessons[index + 1];

  return (
    <>
      <PageHeader eyebrow="Prevention" title={lesson.title} lede={lesson.summary} />
      <Container className="space-y-10 py-12">
        {lesson.status === "placeholder" && <PlaceholderNotice />}

        <div className="prose-body">
          {lesson.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="!mt-0">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="mt-4">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="max-w-3xl space-y-8">
          {lesson.scenarios.map((s) => (
            <ScenarioExercise key={s.id} scenario={s} />
          ))}
        </div>

        <nav aria-label="Lessons" className="flex flex-wrap justify-between gap-4 border-t border-rule pt-6">
          <Link href="/learn">All lessons</Link>
          {next && <Link href={`/learn/${next.slug}`}>Next: {next.title}</Link>}
        </nav>
      </Container>
    </>
  );
}

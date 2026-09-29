import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNotice } from "@/components/notice";
import { lessons } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Prevention",
  description:
    "Short, scenario-based lessons on consent, bystander intervention, coercion, healthy relationships, and peer culture.",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prevention"
        title="What would you do?"
        lede="Short lessons built around real-world situations: parties, relationships, group chats. Most people want to do the right thing; these are about knowing what that looks like in the moment."
      />
      <Container className="py-12">
        {lessons.some((l) => l.status === "placeholder") && (
          <div className="mb-8">
            <PlaceholderNotice>Lessons are early drafts and have not completed editorial review.</PlaceholderNotice>
          </div>
        )}
        <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {lessons.map((lesson) => (
            <li key={lesson.slug} className="bg-paper">
              <Link href={`/learn/${lesson.slug}`} className="block h-full p-6 text-ink no-underline hover:bg-surface">
                <h2 className="text-xl">{lesson.title}</h2>
                <p className="mt-2 text-ink-muted">{lesson.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

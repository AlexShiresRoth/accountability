import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/case/case-view";
import { getCase } from "@/lib/public";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/case/[slug]">): Promise<Metadata> {
  const detail = await getCase((await params).slug);
  if (!detail) return {};
  return {
    title: detail.case.title,
    description: detail.case.summary,
    alternates: { canonical: `/case/${detail.case.slug}` },
    robots: detail.case.isDemo ? { index: false } : undefined,
  };
}

export default async function CasePage({ params }: PageProps<"/case/[slug]">) {
  const detail = await getCase((await params).slug);
  if (!detail) notFound();
  return <CaseView detail={detail} />;
}

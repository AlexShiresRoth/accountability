import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/case/case-view";
import { JsonLd } from "@/components/json-ld";
import { getCase } from "@/lib/public";
import { pageMetadata } from "@/lib/seo";
import { caseStructuredData } from "@/lib/structured-data";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/case/[slug]">): Promise<Metadata> {
  const detail = await getCase((await params).slug);
  if (!detail) return {};
  return pageMetadata({
    title: detail.case.title,
    description: detail.case.summary,
    path: `/case/${detail.case.slug}`,
    type: "article",
    noindex: detail.case.isDemo,
  });
}

export default async function CasePage({ params }: PageProps<"/case/[slug]">) {
  const detail = await getCase((await params).slug);
  if (!detail) notFound();
  return (
    <>
      {!detail.case.isDemo && <JsonLd data={caseStructuredData(detail)} />}
      <CaseView detail={detail} />
    </>
  );
}

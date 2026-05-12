// Server Component — owns generateStaticParams for static export compatibility.
// All client-side logic lives in MenuDetailClient.tsx.
//
// Static export note: IDs come from localStorage at runtime; pre-generation is not
// applicable. Client-side navigation works correctly; direct URL access will 404
// on GitHub Pages (accepted limitation documented in specs/011-gh-pages-deploy/spec.md).

import MenuDetailClient from "./MenuDetailClient";

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [{ id: "_placeholder" }];
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const resolvedParams = await params;
  return <MenuDetailClient params={resolvedParams} />;
}

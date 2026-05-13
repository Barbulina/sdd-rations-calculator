// Server Component. All client-side logic lives in MenuDetailClient.tsx.
// Dynamic routes work natively on Vercel — no static pre-generation needed.

import MenuDetailClient from "./MenuDetailClient";

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const resolvedParams = await params;
  return <MenuDetailClient params={resolvedParams} />;
}

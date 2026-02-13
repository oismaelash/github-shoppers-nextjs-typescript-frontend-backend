import { MarketplacePage } from "@/components/pages/marketplace/MarketplacePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <MarketplacePage locale={locale} />;
}


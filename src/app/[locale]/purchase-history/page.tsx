import { PurchaseHistoryPage } from "@/components/pages/purchases/PurchaseHistoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PurchaseHistoryPage locale={locale} />;
}


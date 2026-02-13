import { MyProductsPage } from "@/components/pages/products/MyProductsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <MyProductsPage locale={locale} />;
}


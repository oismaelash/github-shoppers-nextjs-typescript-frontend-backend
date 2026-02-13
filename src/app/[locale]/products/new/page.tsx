import { CreateProductPage } from "@/components/pages/products/CreateProductPage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CreateProductPage locale={locale} />;
}


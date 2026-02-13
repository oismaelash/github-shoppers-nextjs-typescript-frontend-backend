import { DashboardPage } from "@/components/pages/dashboard/DashboardPage";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DashboardPage locale={locale} />;
}

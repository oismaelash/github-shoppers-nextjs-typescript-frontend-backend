import { SignInPage } from "@/components/pages/auth/SignInPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  return <SignInPage callbackUrl={params?.callbackUrl} />;
}


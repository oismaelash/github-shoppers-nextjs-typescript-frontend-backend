import { SignInPage } from "@/components/pages/auth/SignInPage";

export default function Page({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  return <SignInPage callbackUrl={searchParams?.callbackUrl} />;
}


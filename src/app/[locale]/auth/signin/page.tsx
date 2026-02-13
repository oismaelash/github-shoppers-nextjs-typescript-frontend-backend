import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const qs = searchParams?.callbackUrl
    ? `?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}`
    : "";
  redirect(`/auth/signin${qs}`);
}


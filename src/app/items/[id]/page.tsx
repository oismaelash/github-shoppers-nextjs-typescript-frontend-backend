import { redirect } from "next/navigation";

export default async function ItemRedirectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    redirect(`/marketplace?buy=${id}`);
}

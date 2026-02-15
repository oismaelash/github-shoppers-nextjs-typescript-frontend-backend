import { EditProductPage } from "@/components/pages/products/EditProductPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditProductPage id={id} />;
}

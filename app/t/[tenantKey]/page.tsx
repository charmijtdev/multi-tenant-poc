import { redirect } from "next/navigation";

type TenantIndexPageProps = {
  params: Promise<{
    tenantKey: string;
  }>;
};

export default async function TenantIndexPage({ params }: TenantIndexPageProps) {
  const { tenantKey } = await params;
  redirect(`/t/${tenantKey}/login`);
}

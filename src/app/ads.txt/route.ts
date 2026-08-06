import { getIntegrationsSettings } from "@/lib/admin/integrations";

export const revalidate = 3600;

export async function GET() {
  const integrations = await getIntegrationsSettings();
  const publisherId = integrations.adsensePublisherId.replace(/^ca-/, "");

  const body = publisherId ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n` : "";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

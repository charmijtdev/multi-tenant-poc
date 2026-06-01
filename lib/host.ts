export function getTenantKeyFromHost(host: string | null): string | null {
  if (!host) {
    return null;
  }

  const hostname = host.split(":")[0].toLowerCase();

  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }

  if (hostname.endsWith(".localhost")) {
    return hostname.slice(0, -".localhost".length) || null;
  }

  const rootDomain = process.env.TENANT_ROOT_DOMAIN?.toLowerCase();

  if (rootDomain && hostname.endsWith(`.${rootDomain}`)) {
    const tenantKey = hostname.slice(0, -(rootDomain.length + 1));
    return tenantKey || null;
  }

  return null;
}

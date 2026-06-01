type HeadersLike = {
  get(name: string): string | null;
};

function getProtocol(headersList: HeadersLike) {
  return headersList.get("x-forwarded-proto") ?? "http";
}

export function getRootUrl(headersList: HeadersLike) {
  const rootDomain = process.env.TENANT_ROOT_DOMAIN;
  const protocol = rootDomain ? "https" : getProtocol(headersList);
  const host = headersList.get("host") ?? "localhost:3000";

  if (rootDomain) {
    return `${protocol}://${rootDomain}`;
  }

  if (host.endsWith(".localhost:3000")) {
    return `${protocol}://localhost:3000`;
  }

  return `${protocol}://${host}`;
}

export function getTenantUrl(headersList: HeadersLike, tenantKey: string) {
  const rootDomain = process.env.TENANT_ROOT_DOMAIN;
  const protocol = rootDomain ? "https" : getProtocol(headersList);
  const host = headersList.get("host") ?? "localhost:3000";

  if (rootDomain) {
    return `${protocol}://${tenantKey}.${rootDomain}`;
  }

  if (host === "localhost:3000") {
    return `${protocol}://${tenantKey}.localhost:3000`;
  }

  return `${protocol}://${tenantKey}.${host}`;
}

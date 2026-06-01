"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
type TenantContextValue = {
  id: number;
  organizationName: string;
  tenantKey: string;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: TenantContextValue;
  children: ReactNode;
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const tenant = useContext(TenantContext);

  if (!tenant) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  return tenant;
}

import React, { createContext, useContext, useState } from 'react'
import type { Tenant, Role, UseCase } from '../types'
import { TENANTS } from '../data/tenants'

interface AppContextValue {
  tenants: Tenant[]
  addTenant: (tenant: Tenant) => void
  role: Role
  setRole: (role: Role) => void
  useCase: UseCase
  setUseCase: (useCase: UseCase) => void
  activeTenantId: string | null
  setActiveTenantId: (id: string | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS)
  const [role, setRole] = useState<Role>('provider')
  const [useCase, setUseCase] = useState<UseCase>('internal')
  const [activeTenantId, setActiveTenantId] = useState<string | null>(TENANTS[0].id)

  const addTenant = (tenant: Tenant) => {
    setTenants(prev => [...prev, tenant])
  }

  return (
    <AppContext.Provider value={{ tenants, addTenant, role, setRole, useCase, setUseCase, activeTenantId, setActiveTenantId }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

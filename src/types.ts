export type IsolationTier = 'namespace' | 'cluster' | 'physical' | 'epp'
export type BillingModel = 'chargeback' | 'invoice' | 'per-token' | 'none'
export type OrgType = 'internal' | 'external' | 'api'
export type Role = 'provider' | 'tenant-admin' | 'tenant-user'
export type UseCase = 'internal' | 'external' | 'maas'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'developer' | 'viewer'
  gpusInUse: number
  lastActive: string
  avatar: string
}

export interface Tenant {
  id: string
  name: string
  orgType: OrgType
  isolationTier: IsolationTier
  billingModel: BillingModel
  gpuQuota: number
  gpuUsed: number
  tokenQuotaM: number
  tokenUsedM: number
  status: 'active' | 'provisioning' | 'suspended'
  members: number
  createdAt: string
  idp: string
  costThisMonth: number
  team: TeamMember[]
}

export interface CatalogItem {
  id: string
  name: string
  category: 'model' | 'tool' | 'storage' | 'compute'
  description: string
  icon: string
  external: boolean
  pricePerHour?: number
  available: boolean
}

export interface IsolationOption {
  tier: IsolationTier
  label: string
  description: string
  rhaiStatus: string
  gap: string
  color: string
}

import type { IsolationOption, CatalogItem } from '../types'

export const ISOLATION_OPTIONS: IsolationOption[] = [
  {
    tier: 'namespace',
    label: 'Namespace',
    description: 'Shared cluster with namespace-scoped resource quotas and RBAC. Cost-efficient for trusted internal teams.',
    rhaiStatus: 'Generally Available — RHOAI 2.x with namespace quotas and network policies.',
    gap: 'No GPU time-slicing isolation; noisy-neighbour risk on shared nodes.',
    color: 'teal',
  },
  {
    tier: 'cluster',
    label: 'Dedicated Cluster',
    description: 'Tenant gets a dedicated cluster node pool. Full workload isolation without physical separation.',
    rhaiStatus: 'Generally Available — RHOAI Managed Tenancy with dedicated node selectors and taints.',
    gap: 'Cross-cluster observability and unified billing require manual integration today.',
    color: 'primary',
  },
  {
    tier: 'physical',
    label: 'Physical / Rack',
    description: 'Dedicated bare-metal GPU rack per tenant. Maximum isolation for regulated industries and competitive environments.',
    rhaiStatus: 'Dev Preview — air-gapped rack provisioning available via RHOAI Bare Metal add-on.',
    gap: 'Automated rack provisioning and day-2 lifecycle management not yet GA.',
    color: 'orange',
  },
  {
    tier: 'epp',
    label: 'EPP / KV Cache',
    description: 'API-first isolation via dedicated inference endpoints and KV-cache partitioning. Optimised for token-based SaaS workloads.',
    rhaiStatus: 'Tech Preview — KV-cache aware scheduling available in vLLM 0.6+ on RHOAI.',
    gap: 'EPP admission controller and per-tenant cache quotas still in upstream development.',
    color: 'violet',
  },
]

export const CATALOG_ITEMS: CatalogItem[] = [
  { id: 'llama3-70b', name: 'Llama 3.1 70B', category: 'model', description: 'Open-weight model for general reasoning and code', icon: 'Brain', external: false, available: true },
  { id: 'granite-8b', name: 'IBM Granite 8B', category: 'model', description: 'Enterprise code model with safety tuning', icon: 'Code2', external: false, available: true },
  { id: 'mistral-7b', name: 'Mistral 7B Instruct', category: 'model', description: 'Fast instruction-following model', icon: 'Zap', external: false, available: true },
  { id: 'gpt4o', name: 'GPT-4o', category: 'model', description: 'OpenAI multimodal flagship via MaaS gateway', icon: 'Bot', external: true, pricePerHour: 0.015, available: true },
  { id: 'claude-sonnet', name: 'Claude Sonnet', category: 'model', description: 'Anthropic reasoning model via MaaS gateway', icon: 'MessageSquare', external: true, pricePerHour: 0.012, available: true },
  { id: 'jupyter-gpu', name: 'Jupyter (GPU)', category: 'compute', description: 'Single-user notebook with A10G GPU', icon: 'BookOpen', external: false, available: true },
  { id: 'vscode-server', name: 'VS Code Server', category: 'tool', description: 'Browser-based IDE with GPU passthrough', icon: 'Monitor', external: false, available: true },
  { id: 'vector-store', name: 'pgvector Store', category: 'storage', description: 'Managed PostgreSQL with pgvector extension', icon: 'Database', external: false, available: true },
  { id: 'object-store', name: 'S3-compatible Store', category: 'storage', description: '5 TB quota via Ceph RGW', icon: 'HardDrive', external: false, available: true },
  { id: 'finetuning', name: 'Fine-tuning Pipeline', category: 'compute', description: 'InstructLab fine-tuning on dedicated nodes', icon: 'Layers', external: false, available: false },
]

export const IDP_OPTIONS = [
  { value: 'ldap', label: 'Corporate LDAP' },
  { value: 'azure-ad', label: 'Azure Active Directory' },
  { value: 'okta', label: 'Okta SAML' },
  { value: 'google', label: 'Google Workspace' },
  { value: 'api-key', label: 'API Key (no SSO)' },
]

export const BILLING_OPTIONS = [
  { value: 'chargeback', label: 'Chargeback', description: 'Internal cost allocation to department budget code' },
  { value: 'invoice', label: 'Monthly Invoice', description: 'Net-30 invoice issued to external company' },
  { value: 'per-token', label: 'Per-Token Metering', description: 'Pay-as-you-go by token consumption' },
  { value: 'none', label: 'No Billing', description: 'R&D / sandbox — no cost tracking' },
]

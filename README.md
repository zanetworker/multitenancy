# GPU Tenant Platform

An opinionated tenant UX prototype for GPU-as-a-service platforms. Built to answer: what should the UX look like when a provider creates tenants, and what does each tenant see?

## What this is

This app demonstrates three UX surfaces missing from RHOAI and most GPU cloud platforms:

1. **Provider Admin** — a 3-step wizard that creates a tenant from business questions (not Kubernetes concepts) and reconciles namespace + RBAC + quota + network policy automatically
2. **Tenant Admin** — usage dashboard, team management, and billing surface that varies by billing model (chargeback / invoice / per-token)
3. **Tenant User Portal** — self-service compute catalog, quota bars scoped to THIS tenant only, and an explicit list of what the tenant cannot see

## The core insight

A tenant is not a Kubernetes namespace. It is a business entity with five properties: **identity** (how they auth), **isolation** (what won't be shared), **catalog** (what they can request), **quota** (how much), and **billing** (how usage is metered). All five must be configured together — today, operators wire them manually. This app shows what it looks like when they're managed as one unit.

## Running locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Stack

- React 18 + TypeScript
- Tailwind CSS (custom dark palette)
- React Router v6
- Lucide React icons
- Vite

## Screens

| Route | Who sees it | What it shows |
|-------|-------------|---------------|
| `/` | Provider Admin | All tenants, stats, GPU usage |
| `/create` | Provider Admin | 3-step tenant creation wizard |
| `/tenant/:id/portal` | Tenant User | Self-service catalog + quota |
| `/tenant/:id/admin` | Tenant Admin | Usage, team, billing |

## Isolation decision tree

The wizard's Step 2 asks business questions instead of showing technical options:

1. Who is this tenant? (internal team / external company / application)
2. Could any two tenants be competitors? (→ physical isolation)
3. Hard compliance requirements? (→ physical isolation)

The decision tree maps to: Namespace → Cluster → Physical/Rack → EPP/KV Cache

## Spec

See [gpu-tenant-platform-spec.md](https://github.com/zanetworker/research/blob/main/wiki/agentic-platforms/gpu-tenant-platform-spec.md) for the full product spec.

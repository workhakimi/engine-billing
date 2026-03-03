# GDM Billing Frontend – WeWeb Component

Displays invoices in three sections: Upcoming, Pending, Completed (by `status` column).

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Serve (local dev)

```bash
npm run serve -- --port=8080
```

In WeWeb: Developer popup → Add custom element → `http://localhost:8080`

## Bindings

- `billingData` – list of billing/invoice rows from Supabase (requires `status` column: `upcoming`, `pending`, `completed`)

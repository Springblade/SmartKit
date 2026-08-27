# SmartKit

> Next.js 16 + Better Auth + Drizzle + SePay billing — production-ready SaaS starter kit.

SmartKit là boilerplate cho SaaS nhỏ: có auth (email + Google OAuth + RBAC), billing một lần (SePay VietQR), dashboard protected. Mục tiêu: dev mới clone về, đổi env, deploy trong 1 ngày.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Auth | Better Auth + Drizzle adapter |
| Database | PostgreSQL 16 (Docker) + Drizzle ORM |
| Payment | SePay (VietQR) |
| Email | Resend + React Email |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Validation | Zod |
| Lint/Format | Biome |

## Getting Started

Xem chi tiết ở [`docs/phases/00-overview.md`](docs/phases/00-overview.md) và [`docs/architecture.md`](docs/architecture.md).

### 1. Setup

```bash
# 1. Cài dependencies
pnpm install

# 2. Copy env
cp .env.example .env
# Sửa các giá trị trong .env (xem section "Payment (SePay)" bên dưới cho SePay)

# 3. Start Postgres
docker compose up -d

# 4. Migrate database
pnpm db:migrate

# 5. (Optional) Seed test data — 1 admin + 1 user + 3 plans
pnpm db:seed

# 6. Run dev server
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Test accounts (sau khi seed)

| Email | Password | Role |
|---|---|---|
| `admin@smartkit.local` | `Admin@123456` | admin |
| `user@smartkit.local` | `User@123456` | user |

> ⚠️ Chỉ dùng cho local dev. Production phải đổi password + xoá seed users.

### Verify boilerplate hoạt động

| Bước | URL | Bạn nên thấy |
|---|---|---|
| Trang chủ | `/` | Tiêu đề SmartKit + 2 nút auth |
| Đăng nhập | `/auth/sign-in` | Form email/password + Google button (nếu enabled) |
| Dashboard | `/dashboard` | Nav "Overview/Billing/Lịch sử/Settings" |
| Mua gói | `/billing` | 3 plans (Basic/Pro/Enterprise) sau khi seed |
| Admin | `/admin/users` | Table users (chỉ admin role) |

## Plans

Plans lưu trong bảng `plans` (id, name, price_vnd, is_active). Hiện không có UI admin — dùng `pnpm db:seed` (idempotent) hoặc Drizzle Studio (`pnpm db:studio`) để thêm/sửa.

## Payment (SePay)

SmartKit dùng SePay để nhận thanh toán VietQR (một lần, lifetime — không subscription).

### Setup

1. Đăng ký tại [my.sepay.vn](https://my.sepay.vn).
2. Vào **API** section → copy API key.
3. Vào **Webhook** section → tạo webhook mới, copy secret.
4. Điền 4 biến vào `.env`:

```bash
SEPAY_API_KEY="Bearer your-api-key-here"
SEPAY_WEBHOOK_SECRET="your-webhook-secret-here"
SEPAY_BANK_ACCOUNT="1234567890"   # Số tài khoản nhận tiền
SEPAY_BANK_NAME="VCB"             # Bank code: VCB, TCB, MB, ACB, ...
```

5. Config webhook URL trong SePay dashboard tới `<your-domain>/api/sepay/webhook`. Local dev dùng tunnel (ngrok / cloudflared) — SePay không gọi được `localhost`.
6. Cron auth (production): set `CRON_SECRET` trong Vercel env. Vercel tự gửi `Authorization: Bearer <CRON_SECRET>` cho cron job. Set local dev thì dùng bất kỳ string nào.

### Test

```bash
# Test SePay API connectivity
pnpm test:sepay

# Test billing scenarios (idempotency, signature, amount mismatch, expiry, cancel, etc.)
pnpm test:billing
```

### Plans

Plans tạo bằng `pnpm db:seed` (idempotent) hoặc thêm/sửa qua Drizzle Studio (`pnpm db:studio`).

### End-to-end flow

1. User vào `/billing` → click "Mua" → `createOrder` server action tạo order `pending` (expires sau 15 phút).
2. Order detail page render QR từ `qr.sepay.vn/img` với content `SK {code}`.
3. User scan QR + chuyển khoản → SePay fire webhook tới `/api/sepay/webhook`.
4. Webhook verify HMAC + 5-min replay window → flip order sang `completed`.
5. Client polling mỗi 5s qua `/api/orders/[id]/status` → redirect `/?success=1`.
6. Cron `/api/cron/sepay-poll` mỗi 5 phút backup khi webhook miss, đồng thời expire orders pending quá hạn.

Chi tiết kỹ thuật: [`docs/architecture.md` §7](docs/architecture.md).

## Deploy

```bash
# Build production
pnpm build

# Deploy lên Vercel
vercel deploy
```

Đừng quên set tất cả env vars ở Vercel project (đặc biệt `BETTER_AUTH_SECRET`, `CRON_SECRET`, SePay keys).

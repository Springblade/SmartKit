/**
 * Domain-level error codes for billing actions. Callers (server actions,
 * client components) switch on `code` to display localized messages.
 *
 * Throw via `throw new BillingError('CODE', 'human readable english message')`.
 * Client components should import `BillingError` and branch on `code`,
 * not on `message` (which may change for translation / wording).
 */
export type BillingErrorCode =
  | 'UNAUTHORIZED'
  | 'PLAN_NOT_FOUND'
  | 'PLAN_INACTIVE'
  | 'ALREADY_PURCHASED'
  | 'ORDER_PENDING_EXISTS'
  | 'ORDER_NOT_FOUND_OR_NOT_PENDING'
  | 'SEPAY_NOT_CONFIGURED'
  | 'ORDER_NOT_FOUND'
  | 'ORDER_NOT_PENDING'
  | 'ORDER_FAILED'
  | 'SIMULATION_FAILED';

const VIETNAMESE_MESSAGES: Record<BillingErrorCode, string> = {
  UNAUTHORIZED: 'Bạn cần đăng nhập để tiếp tục.',
  PLAN_NOT_FOUND: 'Không tìm thấy gói này.',
  PLAN_INACTIVE: 'Gói này hiện không khả dụng.',
  ALREADY_PURCHASED: 'Bạn đã sở hữu gói này rồi.',
  ORDER_PENDING_EXISTS: 'Bạn đã có đơn đang chờ cho gói này. Vui lòng hoàn tất hoặc hủy trước khi tạo đơn mới.',
  ORDER_NOT_FOUND_OR_NOT_PENDING: 'Không tìm thấy đơn hoặc đơn không ở trạng thái chờ.',
  SEPAY_NOT_CONFIGURED: 'SePay chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng.',
  ORDER_NOT_PENDING: 'Đơn hàng không ở trạng thái chờ thanh toán.',
  ORDER_FAILED: 'Không thể tạo đơn hàng.',
  SIMULATION_FAILED: 'Mô phỏng thanh toán thất bại.',
};

export class BillingError extends Error {
  readonly code: BillingErrorCode;

  constructor(code: BillingErrorCode, message?: string) {
    super(message ?? VIETNAMESE_MESSAGES[code]);
    this.name = 'BillingError';
    this.code = code;
  }

  /** Localized Vietnamese message suitable for end users. */
  get userMessage(): string {
    return VIETNAMESE_MESSAGES[this.code];
  }
}

import { Button, Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailShell heading="Reset mật khẩu">
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>
        Chào {name}, chúng tôi đã nhận được yêu cầu reset mật khẩu cho tài khoản SmartKit của bạn.
      </Text>
      <Button
        href={resetUrl}
        style={{
          display: 'inline-block',
          backgroundColor: '#000',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          marginTop: '8px',
          marginBottom: '16px',
        }}
      >
        Đặt lại mật khẩu
      </Button>
      <Text style={{ fontSize: '14px', color: '#6b7280' }}>Hoặc copy và paste link bên dưới vào trình duyệt:</Text>
      <Text style={{ fontSize: '13px', color: '#9ca3af', wordBreak: 'break-all' }}>{resetUrl}</Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
        Link hết hạn sau 1 giờ. Nếu bạn không yêu cầu reset mật khẩu, hãy bỏ qua email này và tài khoản của bạn vẫn an
        toàn.
      </Text>
    </EmailShell>
  );
}

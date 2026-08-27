import { Button, Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailShell heading={`Xin chào ${name}!`}>
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>
        Cảm ơn bạn đã đăng ký SmartKit. Vui lòng verify email để kích hoạt tài khoản.
      </Text>
      <Button
        href={verificationUrl}
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
        Verify email
      </Button>
      <Text style={{ fontSize: '14px', color: '#6b7280' }}>Hoặc copy và paste link bên dưới vào trình duyệt:</Text>
      <Text style={{ fontSize: '13px', color: '#9ca3af', wordBreak: 'break-all' }}>{verificationUrl}</Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
        Link hết hạn sau 1 giờ. Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.
      </Text>
    </EmailShell>
  );
}

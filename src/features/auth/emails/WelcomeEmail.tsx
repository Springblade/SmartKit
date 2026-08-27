import { Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailShell heading={`Chào mừng ${name} đến SmartKit!`}>
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>
        Email của bạn đã được xác thực thành công. Bạn có thể bắt đầu sử dụng SmartKit ngay hôm nay.
      </Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
        Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
      </Text>
    </EmailShell>
  );
}

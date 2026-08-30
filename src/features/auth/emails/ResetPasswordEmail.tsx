import { Button, Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

const STRINGS = {
  heading: 'Reset your SmartKit password',
  body: (name: string) => `Hi ${name}, we received a request to reset the password for your SmartKit account.`,
  button: 'Reset password',
  orCopy: 'Or copy and paste this link into your browser:',
  expires:
    'This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email — your account is secure.',
} as const;

export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailShell heading={STRINGS.heading}>
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>{STRINGS.body(name)}</Text>
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
        {STRINGS.button}
      </Button>
      <Text style={{ fontSize: '14px', color: '#6b7280' }}>{STRINGS.orCopy}</Text>
      <Text style={{ fontSize: '13px', color: '#9ca3af', wordBreak: 'break-all' }}>{resetUrl}</Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>{STRINGS.expires}</Text>
    </EmailShell>
  );
}

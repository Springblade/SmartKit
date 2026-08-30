import { Button, Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

const STRINGS = {
  heading: (name: string) => `Hello ${name}!`,
  body: 'Thank you for signing up for SmartKit. Verify your email to activate your account.',
  button: 'Verify email',
  orCopy: 'Or copy and paste this link into your browser:',
  expires: 'This link expires in 1 hour. If you did not request this sign-up, you can safely ignore this email.',
} as const;

export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailShell heading={STRINGS.heading(name)}>
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>{STRINGS.body}</Text>
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
        {STRINGS.button}
      </Button>
      <Text style={{ fontSize: '14px', color: '#6b7280' }}>{STRINGS.orCopy}</Text>
      <Text style={{ fontSize: '13px', color: '#9ca3af', wordBreak: 'break-all' }}>{verificationUrl}</Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>{STRINGS.expires}</Text>
    </EmailShell>
  );
}

import { Text } from 'react-email';
import { EmailShell } from './_components/EmailShell';

interface WelcomeEmailProps {
  name: string;
}

const STRINGS = {
  heading: (name: string) => `Welcome to SmartKit, ${name}!`,
  body1: 'Your email has been verified. You can start using SmartKit right away.',
  body2: "If you have any questions, don't hesitate to reach out.",
} as const;

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailShell heading={STRINGS.heading(name)}>
      <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '24px' }}>{STRINGS.body1}</Text>
      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>{STRINGS.body2}</Text>
    </EmailShell>
  );
}

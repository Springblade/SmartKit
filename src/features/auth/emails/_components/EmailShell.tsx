import { Body, Container, Head, Heading, Html } from 'react-email';

interface EmailShellProps {
  heading: string;
  children: React.ReactNode;
}

const containerStyle = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '480px',
} as const;

const headingStyle = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#111827',
  marginBottom: '16px',
};

const bodyStyle = { fontFamily: 'sans-serif', backgroundColor: '#f9fafb' };

export function EmailShell({ heading, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{heading}</Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

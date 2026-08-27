import { env } from '@/lib/env';

export const websiteConfig = {
  name: 'SmartKit',
  description: 'Vietnamese SaaS Boilerplate',
  url: env.NEXT_PUBLIC_APP_URL,
  keywords: ['saas', 'boilerplate', 'vietnam', 'nextjs'],
  links: {
    github: 'https://github.com/your-org/smartkit',
  },
} as const;

export type WebsiteConfig = typeof websiteConfig;

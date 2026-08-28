import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement } from 'react';

// Add providers here if needed (e.g., ThemeProvider, QueryClientProvider)
function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
export { customRender as render };

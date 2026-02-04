import { ThemeProvider } from '../contexts/ThemeContext';
import type { ReactNode } from 'react';

interface PageWrapperProps {
	children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
	return <ThemeProvider>{children}</ThemeProvider>;
}

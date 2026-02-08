import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useThemeSync() {
	const [theme, setTheme] = useState<Theme>('dark');

	useEffect(() => {
		// Get initial theme
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		const initialTheme = savedTheme || 'dark';
		setTheme(initialTheme);
		document.documentElement.setAttribute('data-theme', initialTheme);

		// Listen for theme changes via custom event
		const handleThemeChange = (e: CustomEvent<Theme>) => {
			setTheme(e.detail);
		};

		window.addEventListener('theme-change', handleThemeChange as EventListener);

		// Also observe DOM attribute changes
		const observer = new MutationObserver(() => {
			const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
			if (currentTheme && currentTheme !== theme) {
				setTheme(currentTheme);
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});

		return () => {
			window.removeEventListener('theme-change', handleThemeChange as EventListener);
			observer.disconnect();
		};
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);

		// Dispatch custom event
		window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
	};

	return { theme, toggleTheme };
}

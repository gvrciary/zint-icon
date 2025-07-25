export interface IconData {
	name: string;
	path: string;
}

export const AVAILABLE_ICONS: Record<string, string> = {
	Heart:
		'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
	Star: 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
	Home: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
	User: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
	Settings:
		'M12.22 2h-.44a2 2 0 0 0-2 2.18l.09 1a2 2 0 0 1-1 1.86l-.91.5a2 2 0 0 0-1.09 1.86l-.22 2.22a2 2 0 0 0 .45 1.63l.8.72a2 2 0 0 1 .59 1.89l-.09 1a2 2 0 0 0 2 2.18h.44a2 2 0 0 0 2-2.18l-.09-1a2 2 0 0 1 1-1.86l.91-.5a2 2 0 0 0 1.09-1.86l.22-2.22a2 2 0 0 0-.45-1.63l-.8-.72a2 2 0 0 1-.59-1.89l.09-1A2 2 0 0 0 12.22 2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
	Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6'
};

export const ICON_NAMES = Object.keys(AVAILABLE_ICONS);

export function getIconPath(iconName: string): string {
	return AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Heart;
}

export function isValidIcon(iconName: string): boolean {
	return iconName in AVAILABLE_ICONS;
}

export const DEFAULT_ICON = 'Star';

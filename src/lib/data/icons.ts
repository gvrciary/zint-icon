const iconModules = import.meta.glob('$lib/assets/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

export const AVAILABLE_ICONS: Record<string, string> = Object.entries(iconModules).reduce(
	(acc, [path, svg]) => {
		const fileName = path.split('/').pop()?.replace('.svg', '') || '';
		const iconName = fileName
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		acc[iconName] = svg;
		return acc;
	},
	{} as Record<string, string>
);

export const ICON_NAMES = Object.keys(AVAILABLE_ICONS);
export const DEFAULT_ICON = 'AcademicCap';

export function getIconSvg(iconName: string, customSvgContent?: string): string {
	if (iconName === 'Custom' && customSvgContent) {
		return customSvgContent;
	}

	return AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS[DEFAULT_ICON];
}

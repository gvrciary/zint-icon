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

export const getRandomIcon = (): string => {
  const randomIndex = Math.floor(Math.random() * ICON_NAMES.length);
  return ICON_NAMES[randomIndex];
};

export function getIconSvg(
  iconName: string,
  customSvgContent?: string,
  customPngContent?: string,
  contentType?: 'svg' | 'png' | null
): string {
  if (iconName === 'Custom') {
    if (contentType === 'png' && customPngContent) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
				<image href="${customPngContent}" width="24" height="24" />
			</svg>`;
    } else if (customSvgContent) {
      return customSvgContent;
    }
  }

  return AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS[DEFAULT_ICON];
}

export interface IconData {
	name: string;
	svg: string;
}

export const AVAILABLE_ICONS: Record<string, string> = {
	Notebook:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/></svg>',
	Heart: `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
				
				<rect width="512" height="512" rx="24" ry="24" fill="#f19ce3"/>
				<g transform="translate(256, 256)">
					<g transform="scale(8) translate(-12, -12)">
						<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" fill="none" stroke="#f2fbff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</g>
				</g>
			</svg>
`,
	Apple:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>'
};

export const ICON_NAMES = Object.keys(AVAILABLE_ICONS);

export function extractSvgElements(svgString: string): string[] {
	const drawingTags = [
		'path',
		'rect',
		'circle',
		'line',
		'ellipse',
		'polygon',
		'polyline',
		'g',
	];
	const elements: string[] = [];

	for (const tag of drawingTags) {
		const regex = new RegExp(`<${tag}[^>]*(?:/>|>[^<]*</${tag}>)`, 'g');
		let match;
		while ((match = regex.exec(svgString)) !== null) {
			elements.push(match[0]);
		}
	}

	return elements;
}

export function getIconElements(iconName: string): string[] {
	const svg = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Heart;
	return extractSvgElements(svg);
}

export function getSvgAttributes(svgString: string): {
	width?: string;
	height?: string;
	viewBox?: string;
	xmlns?: string;
} {
	const attributes: {
		width?: string;
		height?: string;
		viewBox?: string;
		xmlns?: string;
	} = {};

	const widthMatch = svgString.match(/width="([^"]+)"/);
	if (widthMatch) attributes.width = widthMatch[1];

	const heightMatch = svgString.match(/height="([^"]+)"/);
	if (heightMatch) attributes.height = heightMatch[1];

	const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
	if (viewBoxMatch) attributes.viewBox = viewBoxMatch[1];

	const xmlnsMatch = svgString.match(/xmlns="([^"]+)"/);
	if (xmlnsMatch) attributes.xmlns = xmlnsMatch[1];

	return attributes;
}

export function isValidIcon(iconName: string): boolean {
	return iconName in AVAILABLE_ICONS;
}

export const DEFAULT_ICON = 'Heart';

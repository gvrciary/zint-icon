import { parse, stringify, type INode } from 'svgson';

export interface IconData {
	name: string;
	svg: string;
}

export const AVAILABLE_ICONS: Record<string, string> = {
	Notebook:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/></svg>',
	Award: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>`,
	Apple:
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>'
};

export const ICON_NAMES = Object.keys(AVAILABLE_ICONS);

export function extractSvgElements(svgString: string): string[] {
	const drawingTags = ['path', 'rect', 'circle', 'line', 'ellipse', 'polygon', 'polyline', 'g'];

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
	const svg = getIconSvg(iconName);
	return extractSvgElements(svg);
}

export function getIconSvg(iconName: string, customSvgContent?: string): string {
	if (iconName === 'Custom' && customSvgContent) {
		return customSvgContent;
	}
	return AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Award;
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

export const DEFAULT_ICON = 'Award';

export interface ProcessedSvgOptions {
	iconGlow: boolean;
	iconGlass: boolean;
	iconColor: string;
	iconSize: number;
	iconOffsetX: number;
	iconOffsetY: number;
}

function hasFilledElements(elements: INode[]): boolean {
	return elements.some((element) => element.attributes.fill && element.attributes.fill !== 'none');
}

function cloneNode(node: INode): INode {
	return {
		name: node.name,
		type: node.type,
		value: node.value,
		attributes: { ...node.attributes },
		children: node.children.map((child) => cloneNode(child))
	} as INode;
}

function collectDrawingElements(node: INode): INode[] {
	const drawingTags = ['path', 'rect', 'circle', 'line', 'ellipse', 'polygon', 'polyline'];
	const importantAttributes = ['filter', 'mask', 'clip-path', 'clipPath'];
	const elements: INode[] = [];

	if (node.name === 'g' && node.attributes) {
		const hasImportantAttribute = importantAttributes.some(
			(attr) => node.attributes[attr] !== undefined
		);

		if (hasImportantAttribute) {
			elements.push(cloneNode(node));
			return elements;
		}
	}

	if (drawingTags.includes(node.name)) {
		elements.push(cloneNode(node));
	}

	if (node.children) {
		for (const child of node.children) {
			elements.push(...collectDrawingElements(child));
		}
	}

	return elements;
}

function removeDrawingElements(node: INode): INode {
	const drawingTags = ['path', 'rect', 'circle', 'line', 'ellipse', 'polygon', 'polyline'];

	const newNode = {
		name: node.name,
		type: node.type,
		value: node.value,
		attributes: { ...node.attributes },
		children: []
	} as INode;

	if (!drawingTags.includes(node.name) && node.children) {
		newNode.children = node.children
			.filter((child) => !drawingTags.includes(child.name))
			.map((child) => removeDrawingElements(child));
	}

	return newNode;
}

function createGlowFilters(): INode[] {
	const filters = [
		{ id: 'glassBlur1', size: '400%', offset: '-100%', blur: '2', result: 'blur1' },
		{ id: 'glassBlur2', size: '500%', offset: '-150%', blur: '4', result: 'blur2' },
		{ id: 'glassBlur3', size: '600%', offset: '-200%', blur: '6', result: 'blur3' },
		{ id: 'glassBlur4', size: '800%', offset: '-300%', blur: '12', result: 'blur4' },
		{ id: 'glassBlur5', size: '1200%', offset: '-500%', blur: '30', result: 'blur5' }
	];

	return filters.map(
		(filter) =>
			({
				name: 'filter',
				type: 'element',
				value: '',
				attributes: {
					id: filter.id,
					x: filter.offset,
					y: filter.offset,
					width: filter.size,
					height: filter.size
				},
				children: [
					{
						name: 'feGaussianBlur',
						type: 'element',
						value: '',
						attributes: { stdDeviation: filter.blur, result: filter.result },
						children: []
					} as INode
				]
			}) as INode
	);
}

function createGlassGradientAndFilter(iconColor: string): INode[] {
	const r = parseInt(iconColor.slice(1, 3), 16);
	const g = parseInt(iconColor.slice(3, 5), 16);
	const b = parseInt(iconColor.slice(5, 7), 16);

	const gradient = {
		name: 'linearGradient',
		type: 'element',
		value: '',
		attributes: {
			id: 'liquidGlass_stroke',
			x1: '0%',
			y1: '0%',
			x2: '0%',
			y2: '100%',
			gradientUnits: 'objectBoundingBox'
		},
		children: [
			{
				name: 'stop',
				type: 'element',
				value: '',
				attributes: {
					offset: '0%',
					'stop-color': `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, 0.9)`
				},
				children: []
			},
			{
				name: 'stop',
				type: 'element',
				value: '',
				attributes: {
					offset: '30%',
					'stop-color': `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.8)`
				},
				children: []
			},
			{
				name: 'stop',
				type: 'element',
				value: '',
				attributes: {
					offset: '70%',
					'stop-color': `rgba(${r}, ${g}, ${b}, 0.7)`
				},
				children: []
			},
			{
				name: 'stop',
				type: 'element',
				value: '',
				attributes: {
					offset: '100%',
					'stop-color': `rgba(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)}, 0.9)`
				},
				children: []
			}
		]
	} as INode;

	const filter = {
		name: 'filter',
		type: 'element',
		value: '',
		attributes: {
			id: 'liquidGlass_blur',
			x: '-50%',
			y: '-50%',
			width: '200%',
			height: '200%'
		},
		children: [
			{
				name: 'feGaussianBlur',
				type: 'element',
				value: '',
				attributes: { stdDeviation: '1.5', result: 'blurred' },
				children: []
			} as INode
		]
	} as INode;

	return [gradient, filter];
}

function createGlowLayers(drawingElements: INode[], iconColor: string): INode[] {
	const r = parseInt(iconColor.slice(1, 3), 16);
	const g = parseInt(iconColor.slice(3, 5), 16);
	const b = parseInt(iconColor.slice(5, 7), 16);
	const isFilled = hasFilledElements(drawingElements);

	const layers = [
		{
			color: `rgba(${r}, ${g}, ${b}, 0.08)`,
			width: '24',
			filter: 'url(#glassBlur5)',
			opacity: '0.15'
		},
		{
			color: `rgba(${r}, ${g}, ${b}, 0.12)`,
			width: '16',
			filter: 'url(#glassBlur4)',
			opacity: '0.2'
		},
		{
			color: `rgba(${r}, ${g}, ${b}, 0.15)`,
			width: '10',
			filter: 'url(#glassBlur3)',
			opacity: '0.25'
		},
		{
			color: `rgba(${r}, ${g}, ${b}, 0.25)`,
			width: '6',
			filter: 'url(#glassBlur2)',
			opacity: '0.4'
		},
		{
			color: `rgba(${r}, ${g}, ${b}, 0.15)`,
			width: '4',
			filter: 'url(#glassBlur1)',
			opacity: '0.25'
		}
	];

	return layers.map(
		(layer) =>
			({
				name: 'g',
				type: 'element',
				value: '',
				attributes: isFilled
					? {
							fill: layer.color,
							stroke: 'none',
							filter: layer.filter,
							opacity: layer.opacity
						}
					: {
							fill: 'none',
							stroke: layer.color,
							'stroke-width': layer.width,
							'stroke-linecap': 'round',
							'stroke-linejoin': 'round',
							filter: layer.filter,
							opacity: layer.opacity
						},
				children: drawingElements.map((el) => cloneNode(el))
			}) as INode
	);
}

function createGlassLayers(drawingElements: INode[], iconColor: string): INode[] {
	const r = parseInt(iconColor.slice(1, 3), 16);
	const g = parseInt(iconColor.slice(3, 5), 16);
	const b = parseInt(iconColor.slice(5, 7), 16);
	const isFilled = hasFilledElements(drawingElements);

	const mainLayer = {
		name: 'g',
		type: 'element',
		value: '',
		attributes: isFilled
			? {
					fill: 'url(#liquidGlass_stroke)',
					stroke: 'none'
				}
			: {
					fill: 'none',
					stroke: 'url(#liquidGlass_stroke)',
					'stroke-width': '1.75',
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round'
				},
		children: drawingElements.map((el) => cloneNode(el))
	} as INode;

	const secondaryLayer = {
		name: 'g',
		type: 'element',
		value: '',
		attributes: isFilled
			? {
					fill: `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.6)`,
					stroke: 'none',
					opacity: '0.9'
				}
			: {
					fill: 'none',
					stroke: `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.6)`,
					'stroke-width': '1.5',
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round',
					opacity: '0.9'
				},
		children: drawingElements.map((el) => cloneNode(el))
	} as INode;

	return [mainLayer, secondaryLayer];
}

function createNormalLayer(drawingElements: INode[], iconColor: string): INode {
	const isFilled = hasFilledElements(drawingElements);

	return {
		name: 'g',
		type: 'element',
		value: '',
		attributes: isFilled
			? {
					fill: iconColor,
					stroke: 'none'
				}
			: {
					fill: 'none',
					stroke: iconColor,
					'stroke-width': '1.5',
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round'
				},
		children: drawingElements.map((el) => cloneNode(el))
	} as INode;
}

function createTransformGroup(
	iconSize: number,
	iconWidth: number,
	iconHeight: number,
	iconOffsetX: number,
	iconOffsetY: number
): INode {
	return {
		name: 'g',
		type: 'element',
		value: '',
		attributes: {
			transform: `translate(${256 + iconOffsetX}, ${256 + iconOffsetY})`
		},
		children: [
			{
				name: 'g',
				type: 'element',
				value: '',
				attributes: {
					transform: `scale(${iconSize / Math.max(iconWidth, iconHeight)}) translate(${-iconWidth / 2}, ${-iconHeight / 2})`
				},
				children: []
			} as INode
		]
	} as INode;
}

export async function getProcessedSvg(
	iconName: string,
	options: ProcessedSvgOptions,
	customSvgContent?: string
): Promise<string> {
	const svg = getIconSvg(iconName, customSvgContent);

	try {
		const svgAst = await parse(svg);

		const svgAttributes = getSvgAttributes(svg);
		let iconWidth, iconHeight;

		if (svgAttributes.viewBox) {
			const viewBoxParts = svgAttributes.viewBox.split(' ');
			iconWidth = parseInt(viewBoxParts[2]) || 24;
			iconHeight = parseInt(viewBoxParts[3]) || 24;
		} else {
			iconWidth = parseInt(svgAttributes.width || '24');
			iconHeight = parseInt(svgAttributes.height || '24');
		}

		const drawingElements = collectDrawingElements(svgAst);

		const originalDefs = svgAst.children.find((child) => child.name === 'defs');

		const cleanedAst = removeDrawingElements(svgAst);

		cleanedAst.attributes.width = '512';
		cleanedAst.attributes.height = '512';
		cleanedAst.attributes.viewBox = '0 0 512 512';

		let defs = cleanedAst.children.find((child) => child.name === 'defs');
		if (!defs) {
			defs = {
				name: 'defs',
				type: 'element',
				value: '',
				attributes: {},
				children: []
			} as INode;
			cleanedAst.children.unshift(defs);
		}

		if (originalDefs && originalDefs.children) {
			defs.children.push(...originalDefs.children);
		}

		if (options.iconGlow) {
			defs.children.push(...createGlowFilters());
		}

		if (options.iconGlass) {
			defs.children.push(...createGlassGradientAndFilter(options.iconColor));
		}

		const transformGroup = createTransformGroup(
			options.iconSize,
			iconWidth,
			iconHeight,
			options.iconOffsetX,
			options.iconOffsetY
		);
		const innerGroup = transformGroup.children[0];

		if (options.iconGlow) {
			innerGroup.children.push(...createGlowLayers(drawingElements, options.iconColor));
		}

		if (options.iconGlass) {
			innerGroup.children.push(...createGlassLayers(drawingElements, options.iconColor));
		} else {
			innerGroup.children.push(createNormalLayer(drawingElements, options.iconColor));
		}

		cleanedAst.children.push(transformGroup);

		return stringify(cleanedAst);
	} catch (error) {
		console.error('Error processing SVG:', error);
		return svg;
	}
}

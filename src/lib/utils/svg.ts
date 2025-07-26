import type { INode } from 'svgson';

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

function hasFilledElements(elements: INode[]): boolean {
	return elements.some((element) => element.attributes.fill && element.attributes.fill !== 'none');
}

export function cloneNode(node: INode): INode {
	return {
		name: node.name,
		type: node.type,
		value: node.value,
		attributes: { ...node.attributes },
		children: node.children.map((child) => cloneNode(child))
	} as INode;
}

export function collectDrawingElements(node: INode): INode[] {
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

export function createGlowFilters(): INode[] {
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

export function createGlassGradientAndFilter(iconColor: string): INode[] {
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

	const connectivityFilter = {
		name: 'filter',
		type: 'element',
		value: '',
		attributes: {
			id: 'liquidGlass_connectivity',
			x: '-20%',
			y: '-20%',
			width: '140%',
			height: '140%'
		},
		children: [
			{
				name: 'feMorphology',
				type: 'element',
				value: '',
				attributes: {
					operator: 'dilate',
					radius: '0.5',
					result: 'expanded'
				},
				children: []
			} as INode,
			{
				name: 'feGaussianBlur',
				type: 'element',
				value: '',
				attributes: {
					stdDeviation: '0.8',
					result: 'blurred'
				},
				children: []
			} as INode,
			{
				name: 'feComposite',
				type: 'element',
				value: '',
				attributes: {
					in: 'SourceGraphic',
					in2: 'blurred',
					operator: 'over',
					result: 'connected'
				},
				children: []
			} as INode
		]
	} as INode;

	const mainFilter = {
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
				attributes: { stdDeviation: '1.2', result: 'blurred' },
				children: []
			} as INode
		]
	} as INode;

	return [gradient, connectivityFilter, mainFilter];
}

export function createGlowLayers(drawingElements: INode[], iconColor: string): INode[] {
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

export function createGlassLayers(drawingElements: INode[], iconColor: string): INode[] {
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

export function createNormalLayer(drawingElements: INode[], iconColor: string): INode {
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
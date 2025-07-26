import { parse, stringify, type INode } from 'svgson';
import type { ProcessedSvgOptions } from '$lib/types';
import { getIconSvg } from '$lib/data/icons';
import { getSvgAttributes, createGlassLayers, createNormalLayer, createGlowLayers, cloneNode, createGlassGradientAndFilter, collectDrawingElements, createGlowFilters  } from '$lib/utils/svg';

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

		if (!options.iconGlow && !options.iconGlass) {
			const scale = options.iconSize / Math.max(iconWidth, iconHeight);
			const scaledWidth = iconWidth * scale;
			const scaledHeight = iconHeight * scale;
			const x = 256 - scaledWidth / 2 + options.iconOffsetX;
			const y = 256 - scaledHeight / 2 + options.iconOffsetY;

			const modifiedSvg = cloneNode(svgAst);
			modifiedSvg.attributes.width = Math.round(scaledWidth).toString();
			modifiedSvg.attributes.height = Math.round(scaledHeight).toString();
			modifiedSvg.attributes.x = Math.round(x).toString();
			modifiedSvg.attributes.y = Math.round(y).toString();
			modifiedSvg.attributes.style = `color: ${options.iconColor};`;
			modifiedSvg.attributes['alignment-baseline'] = 'middle';

			const containerSvg: INode = {
				name: 'svg',
				type: 'element',
				value: '',
				attributes: {
					width: '512',
					height: '512',
					viewBox: '0 0 512 512',
					fill: 'none',
					xmlns: 'http://www.w3.org/2000/svg',
					'xmlns:xlink': 'http://www.w3.org/1999/xlink',
					class: ''
				},
				children: [modifiedSvg]
			};

			return stringify(containerSvg);
		}

		const containerSvg: INode = {
			name: 'svg',
			type: 'element',
			value: '',
			attributes: {
				width: '512',
				height: '512',
				viewBox: '0 0 512 512',
				fill: 'none',
				xmlns: 'http://www.w3.org/2000/svg',
				'xmlns:xlink': 'http://www.w3.org/1999/xlink',
				class: ''
			},
			children: []
		};

		const defs = {
			name: 'defs',
			type: 'element',
			value: '',
			attributes: {},
			children: []
		} as INode;

		if (options.iconGlow) {
			defs.children.push(...createGlowFilters());
		}

		if (options.iconGlass) {
			defs.children.push(...createGlassGradientAndFilter(options.iconColor));
		}

		containerSvg.children.push(defs);

		const drawingElements = collectDrawingElements(svgAst);

		if (options.iconGlow) {
			const transformGroup: INode = {
				name: 'g',
				type: 'element',
				value: '',
				attributes: {
					transform: `translate(${256 + options.iconOffsetX}, ${256 + options.iconOffsetY})`
				},
				children: [
					{
						name: 'g',
						type: 'element',
						value: '',
						attributes: {
							transform: `scale(${options.iconSize / Math.max(iconWidth, iconHeight)}) translate(${-iconWidth / 2}, ${-iconHeight / 2})`
						},
						children: [...createGlowLayers(drawingElements, options.iconColor)]
					} as INode
				]
			} as INode;

			if (options.iconGlass) {
				transformGroup.children[0].children.push(
					...createGlassLayers(drawingElements, options.iconColor)
				);
			} else {
				transformGroup.children[0].children.push(
					createNormalLayer(drawingElements, options.iconColor)
				);
			}

			containerSvg.children.push(transformGroup);
		} else {
			const scale = options.iconSize / Math.max(iconWidth, iconHeight);
			const scaledWidth = iconWidth * scale;
			const scaledHeight = iconHeight * scale;
			const x = 256 - scaledWidth / 2 + options.iconOffsetX;
			const y = 256 - scaledHeight / 2 + options.iconOffsetY;

			const nestedSvg: INode = {
				name: 'svg',
				type: 'element',
				value: '',
				attributes: {
					xmlns: 'http://www.w3.org/2000/svg',
					fill: 'none',
					viewBox: svgAttributes.viewBox || `0 0 ${iconWidth} ${iconHeight}`,
					width: Math.round(scaledWidth).toString(),
					height: Math.round(scaledHeight).toString(),
					x: Math.round(x).toString(),
					y: Math.round(y).toString(),
					style: `color: ${options.iconColor};`,
					'alignment-baseline': 'middle'
				},
				children: []
			};

			if (options.iconGlass) {
				nestedSvg.children.push(...createGlassLayers(drawingElements, options.iconColor));
			} else {
				nestedSvg.children.push(createNormalLayer(drawingElements, options.iconColor));
			}

			containerSvg.children.push(nestedSvg);
		}

		return stringify(containerSvg);
	} catch (error) {
		console.error('Error processing SVG:', error);
		return svg;
	}
}

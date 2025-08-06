import { parse, stringify, type INode } from 'svgson';
import type { ProcessedSvgOptions } from '$lib/types';
import { getIconSvg } from '$lib/data/icons';
import {
	getSvgAttributes,
	createGlassLayers,
	createNormalLayer,
	createGlowLayers,
	cloneNode,
	createGlassGradientAndFilter,
	collectDrawingElements,
	createGlowFilters
} from '$lib/utils/svg';
import { get } from 'svelte/store';
import {
	selectedIcon,
	iconColor,
	iconSize,
	iconOffsetX,
	iconOffsetY,
	iconGlass,
	iconGlow,
	customSvg,
	customPng,
	customContentType,
	borderRadius,
	borderStroke,
	borderColor,
	borderOpacity,
	background3D,
	background3DRotation,
	meshGradientColors,
	noise,
	contrast,
	saturation,
	brightness
} from '$lib/stores/icon';
import { initRender } from '$lib/webgl/mesh-render';
import vertexShader from '$lib/utils/shaders/shaders.vert?raw';
import fragmentShader from '$lib/utils/shaders/shaders.frag?raw';

export async function getCompleteSVG(): Promise<string> {
	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = 512;
	tempCanvas.height = 512;

	const renderContext = initRender(tempCanvas, vertexShader, fragmentShader, {
		meshGradientColors: get(meshGradientColors),
		noise: get(noise),
		contrast: get(contrast),
		saturation: get(saturation),
		brightness: get(brightness)
	});

	renderContext.render();

	const backgroundImageData = tempCanvas.toDataURL('image/png');

	renderContext.cleanup();

	const iconSvg = await getProcessedSvg(
		get(selectedIcon),
		{
			iconGlow: get(iconGlow),
			iconGlass: get(iconGlass),
			iconColor: get(iconColor),
			iconSize: get(iconSize),
			iconOffsetX: get(iconOffsetX),
			iconOffsetY: get(iconOffsetY)
		},
		get(customSvg),
		get(customPng),
		get(customContentType)
	);

	const borderStrokeStyle = (() => {
		const opacity = get(borderOpacity) / 100;
		const r = parseInt(get(borderColor).slice(1, 3), 16);
		const g = parseInt(get(borderColor).slice(3, 5), 16);
		const b = parseInt(get(borderColor).slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	})();

	let defs = '';
	let backgroundElements = '';
	let borderElement = '';

	defs += `
			<clipPath id="borderClip">
				<rect width="512" height="512" rx="${get(borderRadius)}" ry="${get(borderRadius)}" />
			</clipPath>
		`;

	backgroundElements = `<image href="${backgroundImageData}" width="512" height="512" clip-path="url(#borderClip)" />`;

	if (get(background3D)) {
		defs += `
				<linearGradient
					id="edge3D"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
					gradientTransform="rotate(${get(background3DRotation)})"
				>
					<stop offset="0%" style="stop-color:rgba(255,255,255,0.5);stop-opacity:1" />
					<stop offset="30%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
					<stop offset="70%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
					<stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
				</linearGradient>
				<filter id="edge3DBlur" x="-10%" y="-10%" width="120%" height="120%">
					<feGaussianBlur stdDeviation="2" result="blurred" />
				</filter>
			`;

		backgroundElements += `
				<rect
					width="512"
					height="512"
					rx="${get(borderRadius)}"
					ry="${get(borderRadius)}"
					fill="none"
					stroke="url(#edge3D)"
					stroke-width="20"
					filter="url(#edge3DBlur)"
					clip-path="url(#borderClip)"
				/>
			`;
	}

	if (get(borderStroke) > 0) {
		borderElement = `
				<rect
					width="512"
					height="512"
					rx="${get(borderRadius)}"
					ry="${get(borderRadius)}"
					fill="none"
					stroke="${borderStrokeStyle}"
					stroke-width="${get(borderStroke)}"
				/>
			`;
	}

	const iconContent = iconSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>$/, '');

	return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			${defs ? `<defs>${defs}</defs>` : ''}
			${backgroundElements}
			${borderElement}
			${iconContent}
		</svg>`;
}

export async function getProcessedSvg(
	iconName: string,
	options: ProcessedSvgOptions,
	customSvgContent?: string,
	customPngContent?: string,
	contentType?: 'svg' | 'png' | null
): Promise<string> {
	const svg = getIconSvg(iconName, customSvgContent, customPngContent, contentType);

	try {
		const svgAst = await parse(svg);
		const svgAttributes = getSvgAttributes(svg);

		if (iconName === 'Custom' && contentType && contentType === 'png') {
			iconGlow.set(false);
			iconGlass.set(false);
		}

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

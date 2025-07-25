<script lang="ts">
	import { getIconPath } from '$lib/data/icons';
	import {
		selectedIcon,
		iconColor,
		noise,
		borderRadius,
		borderStroke,
		borderColor,
		borderOpacity,
		meshGradientColors,
		iconSize,
		iconOffsetX,
		iconOffsetY,
		iconGlass,
		background3D,
		background3DRotation,
		iconGlow,
		contrast,
		saturation,
		brightness
	} from '$lib/stores/icon';
	import vertexShader from '$lib/shaders/shaders.vert?raw';
	import fragmentShader from '$lib/shaders/shaders.frag?raw';
	import { initRender } from '$lib/webgl/mesh-render';

	let canvasRef: HTMLCanvasElement;
	let render: () => void;

	const iconPath = $derived(getIconPath($selectedIcon));

	const borderStrokeStyle = $derived(() => {
		if ($borderStroke === 0) return {};
		const opacity = $borderOpacity / 100;
		const r = parseInt($borderColor.slice(1, 3), 16);
		const g = parseInt($borderColor.slice(3, 5), 16);
		const b = parseInt($borderColor.slice(5, 7), 16);
		const strokeColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
		return {
			stroke: strokeColor,
			'stroke-width': $borderStroke,
			fill: 'transparent'
		};
	});

	$effect(() => {
		if (!canvasRef) return;

		render = initRender(canvasRef, vertexShader, fragmentShader, {
			meshGradientColors: $meshGradientColors,
			noise: $noise,
			contrast: $contrast,
			saturation: $saturation,
			brightness: $brightness
		});

		render();
	});

	$effect(() => {
		if (!render) return;

		render();
	});

	const rectRadius = $derived($borderRadius);
</script>

<div class="flex flex-col items-center space-y-6">
	<div
		class="relative overflow-hidden bg-transparent shadow-2xl"
		style="border-radius: {$borderRadius}px;"
	>
		<div
			class="absolute inset-0 opacity-20"
			style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+'); background-size: 20px 20px;"
		></div>

		<canvas
			bind:this={canvasRef}
			width="512"
			height="512"
			class="absolute inset-0 z-0"
			style="border-radius: {$borderRadius}px;"
		></canvas>

		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			xmlns="http://www.w3.org/2000/svg"
			class="relative z-10 block"
			style="background: transparent;"
		>
			<defs>
				{#if $background3D}
					<linearGradient
						id="edge3D"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
						gradientTransform="rotate({$background3DRotation})"
					>
						<stop offset="0%" style="stop-color:rgba(255,255,255,0.5);stop-opacity:1" />
						<stop offset="30%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
						<stop offset="70%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
						<stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
					</linearGradient>
					<filter id="edge3DBlur" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="3" result="blurred" />
					</filter>
				{/if}

				{#if $iconGlow}
					<filter id="glassBlur1" x="-100%" y="-100%" width="400%" height="400%">
						<feGaussianBlur stdDeviation="2" result="blur1" />
					</filter>

					<filter id="glassBlur2" x="-150%" y="-150%" width="500%" height="500%">
						<feGaussianBlur stdDeviation="4" result="blur2" />
					</filter>

					<filter id="glassBlur3" x="-200%" y="-200%" width="600%" height="600%">
						<feGaussianBlur stdDeviation="6" result="blur3" />
					</filter>

					<filter id="glassBlur4" x="-300%" y="-300%" width="800%" height="800%">
						<feGaussianBlur stdDeviation="12" result="blur4" />
					</filter>

					<filter id="glassBlur5" x="-500%" y="-500%" width="1200%" height="1200%">
						<feGaussianBlur stdDeviation="30" result="blur5" />
					</filter>
				{/if}

				{#if $iconGlass}
					<linearGradient
						id="liquidGlass_stroke"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
						gradientUnits="objectBoundingBox"
					>
						<stop
							offset="0%"
							stop-color="rgba({Math.min(
								255,
								parseInt($iconColor.slice(1, 3), 16) + 80
							)}, {Math.min(255, parseInt($iconColor.slice(3, 5), 16) + 80)}, {Math.min(
								255,
								parseInt($iconColor.slice(5, 7), 16) + 80
							)}, 0.9)"
						/>
						<stop
							offset="30%"
							stop-color="rgba({Math.min(
								255,
								parseInt($iconColor.slice(1, 3), 16) + 40
							)}, {Math.min(255, parseInt($iconColor.slice(3, 5), 16) + 40)}, {Math.min(
								255,
								parseInt($iconColor.slice(5, 7), 16) + 40
							)}, 0.8)"
						/>
						<stop
							offset="70%"
							stop-color="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.7)"
						/>
						<stop
							offset="100%"
							stop-color="rgba({Math.floor(
								parseInt($iconColor.slice(1, 3), 16) * 0.4
							)}, {Math.floor(parseInt($iconColor.slice(3, 5), 16) * 0.4)}, {Math.floor(
								parseInt($iconColor.slice(5, 7), 16) * 0.4
							)}, 0.9)"
						/>
					</linearGradient>

					<filter id="liquidGlass_blur" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="1.5" result="blurred" />
					</filter>
				{/if}
			</defs>

			{#if $background3D}
				<rect
					width="512"
					height="512"
					rx={rectRadius}
					ry={rectRadius}
					fill="none"
					stroke="url(#edge3D)"
					stroke-width="20"
					filter="url(#edge3DBlur)"
				/>
			{/if}
			{#if $borderStroke > 0}
				<rect
					width="512"
					height="512"
					rx={rectRadius}
					ry={rectRadius}
					fill="none"
					stroke={borderStrokeStyle().stroke}
					stroke-width={$borderStroke}
				/>
			{/if}

			<g transform="translate({256 + $iconOffsetX}, {256 + $iconOffsetY})">
				<g transform="scale({$iconSize / 24}) translate(-12, -12)">
					{#if $iconGlow}
						<path
							d={iconPath}
							fill="none"
							stroke="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.08)"
							stroke-width="24"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#glassBlur5)"
							opacity="0.15"
						/>

						<path
							d={iconPath}
							fill="none"
							stroke="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.12)"
							stroke-width="16"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#glassBlur4)"
							opacity="0.2"
						/>

						<path
							d={iconPath}
							fill="none"
							stroke="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.15)"
							stroke-width="10"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#glassBlur3)"
							opacity="0.25"
						/>

						<path
							d={iconPath}
							fill="none"
							stroke="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.25)"
							stroke-width="6"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#glassBlur2)"
							opacity="0.4"
						/>

						<path
							d={iconPath}
							fill="none"
							stroke="rgba({parseInt($iconColor.slice(1, 3), 16)}, {parseInt(
								$iconColor.slice(3, 5),
								16
							)}, {parseInt($iconColor.slice(5, 7), 16)}, 0.15)"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#glassBlur1)"
							opacity="0.25"
						/>
					{/if}

					{#if $iconGlass}
						<path
							d={iconPath}
							fill="none"
							stroke="url(#liquidGlass_stroke)"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>

						<path
							d={iconPath}
							fill="none"
							stroke="rgba({Math.min(255, parseInt($iconColor.slice(1, 3), 16) + 20)}, {Math.min(
								255,
								parseInt($iconColor.slice(3, 5), 16) + 20
							)}, {Math.min(255, parseInt($iconColor.slice(5, 7), 16) + 20)}, 0.6)"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							opacity="0.9"
						/>
					{:else}
						<path
							d={iconPath}
							fill="none"
							stroke={$iconColor}
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{/if}
				</g>
			</g>
		</svg>
	</div>
</div>

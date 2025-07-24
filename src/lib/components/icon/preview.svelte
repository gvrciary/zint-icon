<script lang="ts">
	import { cn } from '$lib/utils';
	import { getIconPath } from '$lib/data/icons';
	import {
		selectedIcon,
		backgroundType,
		backgroundColor,
		gradientStops,
		gradientAngle,
		iconColor,
		noise,
		borderRadius,
		borderStroke,
		borderColor,
		borderOpacity
	} from '$lib/stores/icon';

	let svgRef: SVGSVGElement;

	const gradientId = 'icon-gradient';
	const noiseId = 'noise-filter';

	const backgroundFill = $derived(
		$backgroundType === 'solid' ? $backgroundColor : `url(#${gradientId})`
	);

	const sortedGradientStops = $derived([...$gradientStops].sort((a, b) => a.position - b.position));

	const gradientCoords = $derived(() => {
		if ($backgroundType !== 'linear') return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };

		const angleRad = ($gradientAngle * Math.PI) / 180;

		const x1 = 50 + 50 * Math.cos(angleRad + Math.PI / 2);
		const y1 = 50 + 50 * Math.sin(angleRad + Math.PI / 2);
		const x2 = 50 + 50 * Math.cos(angleRad - Math.PI / 2);
		const y2 = 50 + 50 * Math.sin(angleRad - Math.PI / 2);

		return {
			x1: `${x1}%`,
			y1: `${y1}%`,
			x2: `${x2}%`,
			y2: `${y2}%`
		};
	});

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
			fill: backgroundFill
		};
	});

	const rectRadius = $derived($borderRadius);
</script>

<div class={cn('flex flex-col items-center space-y-6')}>
	<div
		class="relative overflow-hidden bg-transparent shadow-2xl"
		style="border-radius: {$borderRadius}px;"
	>
		<div
			class="absolute inset-0 opacity-20"
			style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+'); background-size: 20px 20px;"
		></div>
		<svg
			bind:this={svgRef}
			width="512"
			height="512"
			viewBox="0 0 512 512"
			xmlns="http://www.w3.org/2000/svg"
			class="relative z-10 block"
			style="background: transparent;"
		>
			<defs>
				{#if $backgroundType === 'linear'}
					<linearGradient
						id={gradientId}
						x1={gradientCoords().x1}
						y1={gradientCoords().y1}
						x2={gradientCoords().x2}
						y2={gradientCoords().y2}
					>
						{#each sortedGradientStops as stop, index (`${index}-${stop.position}-${stop.color}`)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</linearGradient>
				{:else if $backgroundType === 'radial'}
					<radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
						{#each sortedGradientStops as stop, index (`${index}-${stop.position}-${stop.color}`)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</radialGradient>
				{/if}

				{#if $noise > 0}
					<filter id={noiseId}>
						<feTurbulence baseFrequency="0.65" numOctaves="4" seed="1" result="noise" />
						<feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
						<feBlend
							in="SourceGraphic"
							in2="monoNoise"
							mode="multiply"
							opacity={($noise / 100) * 0.6}
						/>
					</filter>
				{/if}
			</defs>

			<rect
				width="512"
				height="512"
				rx={rectRadius}
				ry={rectRadius}
				fill={backgroundFill}
				stroke={$borderStroke > 0 ? borderStrokeStyle().stroke : 'none'}
				stroke-width={$borderStroke}
				filter={$noise > 0 ? `url(#${noiseId})` : undefined}
			/>

			<g transform="translate(256, 256)">
				<g transform="scale(8) translate(-12, -12)">
					<path
						d={iconPath}
						fill="none"
						stroke={$iconColor}
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</g>
		</svg>
	</div>

	<div class="space-y-1 text-center">
		<p class="text-sm font-medium text-zinc-300">{$selectedIcon}</p>
		<p class="text-xs text-zinc-500">512 × 512 pixels</p>
	</div>
</div>

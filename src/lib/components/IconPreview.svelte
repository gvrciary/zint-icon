<script lang="ts">
	import { cn } from '$lib/utils';
	import { getIconPath, DEFAULT_ICON } from '$lib/data/icons';

	interface GradientStop {
		color: string;
		position: number;
	}

	interface Props {
		selectedIcon?: string;
		backgroundType?: 'solid' | 'linear' | 'radial';
		backgroundColor?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
		iconColor?: string;
		class?: string;
	}

	let {
		selectedIcon = DEFAULT_ICON,
		backgroundType = 'solid',
		backgroundColor = '#8564FA',
		gradientStops = [
			{ color: '#8564FA', position: 0 },
			{ color: '#FF6B6B', position: 100 }
		],
		gradientAngle = 45,
		iconColor = '#ffffff',
		class: className = '',
		...restProps
	}: Props = $props();

	let svgRef: SVGSVGElement;

	const gradientId = 'icon-gradient';

	const backgroundFill = $derived(
		backgroundType === 'solid' ? backgroundColor : `url(#${gradientId})`
	);

	const sortedGradientStops = $derived([...gradientStops].sort((a, b) => a.position - b.position));

	const gradientCoords = $derived(() => {
		if (backgroundType !== 'linear') return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };

		const angleRad = (gradientAngle * Math.PI) / 180;

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

	const iconPath = $derived(getIconPath(selectedIcon));
</script>

<div class={cn('flex flex-col items-center space-y-6', className)} {...restProps}>
	<div class="relative">
		<svg
			bind:this={svgRef}
			width="512"
			height="512"
			viewBox="0 0 512 512"
			xmlns="http://www.w3.org/2000/svg"
			class="rounded-3xl border border-white/5 shadow-2xl"
		>
			<defs>
				{#if backgroundType === 'linear'}
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
				{:else if backgroundType === 'radial'}
					<radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
						{#each sortedGradientStops as stop, index (`${index}-${stop.position}-${stop.color}`)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</radialGradient>
				{/if}
			</defs>

			<rect width="512" height="512" rx="24" ry="24" fill={backgroundFill} />

			<g transform="translate(256, 256)">
				<g transform="scale(8) translate(-12, -12)">
					<path
						d={iconPath}
						fill="none"
						stroke={iconColor}
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</g>
		</svg>
	</div>

	<div class="space-y-1 text-center">
		<p class="text-sm font-medium text-zinc-300">{selectedIcon}</p>
		<p class="text-xs text-zinc-500">512 × 512 pixels</p>
	</div>
</div>

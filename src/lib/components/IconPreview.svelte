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
					<linearGradient id={gradientId} gradientTransform="rotate({gradientAngle} 256 256)">
						{#each sortedGradientStops as stop (stop.position)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</linearGradient>
				{:else if backgroundType === 'radial'}
					<radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
						{#each sortedGradientStops as stop (stop.position)}
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

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Plus, Minus } from 'lucide-svelte';
	import Button from './ui/button.svelte';
	import Slider from './ui/slider.svelte';

	interface GradientStop {
		color: string;
		position: number;
	}

	interface Props {
		type: 'solid' | 'linear' | 'radial';
		solidColor?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
		class?: string;
		onChange?: (config: {
			type: 'solid' | 'linear' | 'radial';
			solidColor?: string;
			gradientStops?: GradientStop[];
			gradientAngle?: number;
		}) => void;
	}

	let {
		type = 'solid',
		solidColor = '#8564FA',
		gradientStops = [
			{ color: '#8564FA', position: 0 },
			{ color: '#FF6B6B', position: 100 }
		],
		gradientAngle = 45,
		class: className = '',
		onChange,
		...restProps
	}: Props = $props();

	const predefinedColors = [
		'#8564FA',
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#96CEB4',
		'#FFEAA7',
		'#DDA0DD',
		'#98D8C8',
		'#F7DC6F',
		'#BB8FCE',
		'#85C1E9',
		'#F8C471',
		'#EC7063',
		'#58D68D',
		'#5DADE2',
		'#AF7AC5',
		'#F4D03F',
		'#52C4B0'
	];

	function updateSolidColor(color: string) {
		solidColor = color;
		emitChange();
	}

	function updateGradientStop(index: number, color: string) {
		gradientStops[index].color = color;
		emitChange();
	}

	function updateGradientPosition(index: number, position: number) {
		gradientStops[index].position = position;
		emitChange();
	}

	function addGradientStop() {
		const newPosition =
			gradientStops.length > 0
				? Math.min(...gradientStops.map((s) => s.position)) +
					(Math.max(...gradientStops.map((s) => s.position)) -
						Math.min(...gradientStops.map((s) => s.position))) /
						2
				: 50;

		gradientStops.push({ color: '#8564FA', position: newPosition });
		emitChange();
	}

	function removeGradientStop(index: number) {
		if (gradientStops.length > 2) {
			gradientStops.splice(index, 1);
			emitChange();
		}
	}

	function updateGradientAngle(angle: number) {
		gradientAngle = angle;
		emitChange();
	}

	function emitChange() {
		onChange?.({
			type,
			solidColor,
			gradientStops: [...gradientStops],
			gradientAngle
		});
	}

	const gradientPreview = $derived(() => {
		if (type === 'solid') return solidColor;

		const stops = gradientStops
			.sort((a, b) => a.position - b.position)
			.map((stop) => `${stop.color} ${stop.position}%`)
			.join(', ');

		if (type === 'radial') {
			return `radial-gradient(circle, ${stops})`;
		}

		return `linear-gradient(${gradientAngle}deg, ${stops})`;
	});
</script>

<div class={cn('space-y-4 overflow-hidden', className)} {...restProps}>
	{#if type === 'solid'}
		<div class="space-y-3 overflow-hidden">
			<div class="flex items-center gap-3">
				<div
					class="h-8 w-8 flex-shrink-0 rounded-lg border border-zinc-700"
					style="background: {solidColor}"
				></div>
				<input
					type="color"
					bind:value={solidColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="h-8 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
				/>
				<input
					type="text"
					bind:value={solidColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#8564FA]/50 focus:outline-none"
					placeholder="#8564FA"
				/>
			</div>

			<div class="grid grid-cols-6 gap-2">
				{#each predefinedColors as color (color)}
					<button
						type="button"
						class={cn(
							'h-8 w-8 rounded-lg border-2 transition-all hover:scale-110',
							solidColor.toLowerCase() === color.toLowerCase()
								? 'border-white'
								: 'border-zinc-700 hover:border-zinc-500'
						)}
						style="background: {color}"
						onclick={() => updateSolidColor(color)}
						aria-label={`Select color ${color}`}
					></button>
				{/each}
			</div>
		</div>
	{:else}
		<div class="space-y-4 overflow-hidden">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="h-8 w-16 flex-shrink-0 rounded-lg border border-zinc-700"
						style="background: {gradientPreview}"
					></div>
					<span class="text-sm font-medium text-zinc-300">
						{type === 'linear' ? 'Linear' : 'Radial'} Gradient
					</span>
				</div>
			</div>

			{#if type === 'linear'}
				<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
					<Slider
						value={gradientAngle}
						min={0}
						max={360}
						step={1}
						label="Angle"
						showValue={true}
						onChange={updateGradientAngle}
					/>
				</div>
			{/if}

			<div class="space-y-3 overflow-hidden">
				<div class="flex items-center justify-between">
					<span class="text-sm text-zinc-300">Color Stops</span>
					<Button variant="secondary" size="sm" onclick={addGradientStop}>
						<Plus class="h-3 w-3" />
						Add
					</Button>
				</div>

				<div class="max-h-48 space-y-2 overflow-y-auto">
					{#each gradientStops as stop, index (index)}
						<div class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/20 p-3">
							<div
								class="h-6 w-6 flex-shrink-0 rounded-md border border-zinc-700"
								style="background: {stop.color}"
							></div>
							<input
								type="color"
								bind:value={stop.color}
								oninput={(e) => updateGradientStop(index, e.currentTarget.value)}
								class="h-6 w-8 flex-shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-transparent"
							/>
							<input
								type="text"
								bind:value={stop.color}
								oninput={(e) => updateGradientStop(index, e.currentTarget.value)}
								class="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-xs text-white"
								placeholder="#000000"
							/>
							<div class="flex flex-shrink-0 items-center gap-1">
								<input
									type="number"
									min="0"
									max="100"
									bind:value={stop.position}
									oninput={(e) => updateGradientPosition(index, parseInt(e.currentTarget.value))}
									class="w-14 rounded-md border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-center text-xs text-white focus:border-[#8564FA]/50 focus:ring-1 focus:ring-[#8564FA]/50 focus:outline-none"
								/>
								<span class="text-xs text-zinc-500">%</span>
							</div>
							{#if gradientStops.length > 2}
								<Button
									variant="secondary"
									size="sm"
									onclick={() => removeGradientStop(index)}
									class="flex-shrink-0 !p-1 hover:!bg-red-500/20"
								>
									<Minus class="h-3 w-3 text-red-400" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
</style>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Plus, Minus } from 'lucide-svelte';
	import Button from './Button.svelte';

	interface GradientStop {
		color: string;
		position: number;
	}

	interface Props {
		type: 'solid' | 'linear';
		solidColor?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
		class?: string;
		onChange?: (config: {
			type: 'solid' | 'linear';
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

		return `linear-gradient(${gradientAngle}deg, ${stops})`;
	});
</script>

<div class={cn('space-y-4', className)} {...restProps}>
	{#if type === 'solid'}
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<div
					class="h-8 w-8 rounded-lg border border-zinc-700"
					style="background: {solidColor}"
				></div>
				<input
					type="color"
					bind:value={solidColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="h-8 w-12 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
				/>
				<input
					type="text"
					bind:value={solidColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="flex-1 rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#8564FA]/50 focus:outline-none"
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
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div
					class="h-8 w-16 rounded-lg border border-zinc-700"
					style="background: {gradientPreview}"
				></div>
				<div class="flex-1">
					<label for="gradient-angle" class="mb-1 block text-xs text-zinc-400">Angle</label>
					<input
						id="gradient-angle"
						type="range"
						min="0"
						max="360"
						bind:value={gradientAngle}
						oninput={(e) => updateGradientAngle(parseInt(e.currentTarget.value))}
						class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800"
					/>
					<div class="mt-1 text-xs text-zinc-500">{gradientAngle}°</div>
				</div>
			</div>

			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-zinc-300">Color Stops</span>
					<Button variant="secondary" size="sm" onclick={addGradientStop}>
						<Plus class="h-3 w-3" />
						Add
					</Button>
				</div>

				{#each gradientStops as stop, index (index)}
					<div class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/20 p-3">
						<div
							class="h-6 w-6 rounded-md border border-zinc-700"
							style="background: {stop.color}"
						></div>
						<input
							type="color"
							bind:value={stop.color}
							oninput={(e) => updateGradientStop(index, e.currentTarget.value)}
							class="h-6 w-8 cursor-pointer rounded-md border border-zinc-700 bg-transparent"
						/>
						<input
							type="text"
							bind:value={stop.color}
							oninput={(e) => updateGradientStop(index, e.currentTarget.value)}
							class="flex-1 rounded-md border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-xs text-white"
						/>
						<div class="flex items-center gap-1">
							<input
								type="number"
								min="0"
								max="100"
								bind:value={stop.position}
								oninput={(e) => updateGradientPosition(index, parseInt(e.currentTarget.value))}
								class="w-12 rounded-md border border-zinc-700 bg-zinc-900/50 px-1 py-1 text-center text-xs text-white"
							/>
							<span class="text-xs text-zinc-500">%</span>
						</div>
						{#if gradientStops.length > 2}
							<Button
								variant="secondary"
								size="sm"
								onclick={() => removeGradientStop(index)}
								class="!p-1 hover:!bg-red-500/20"
							>
								<Minus class="h-3 w-3 text-red-400" />
							</Button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
	}

	.slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
		box-sizing: border-box;
	}
</style>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Plus, Minus } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
	import { backgroundType, backgroundColor, gradientStops, gradientAngle } from '$lib/stores/icon';

	function updateSolidColor(color: string) {
		backgroundColor.set(color);
	}
	
	console.log('hola')

	function updateGradientStop(index: number, color: string) {
		gradientStops.set($gradientStops.map((stop, i) => (i === index ? { ...stop, color } : stop)));
	}

	function updateGradientPosition(index: number, position: number) {
		gradientStops.set(
			$gradientStops.map((stop, i) => (i === index ? { ...stop, position } : stop))
		);
	}

	function addGradientStop() {
		const newPosition =
			$gradientStops.length > 0
				? Math.min(...$gradientStops.map((s) => s.position)) +
					(Math.max(...$gradientStops.map((s) => s.position)) -
						Math.min(...$gradientStops.map((s) => s.position))) /
						2
				: 50;

		gradientStops.set([...$gradientStops, { color: '#8564FA', position: newPosition }]);
	}

	function removeGradientStop(index: number) {
		if ($gradientStops.length > 2) {
			gradientStops.set($gradientStops.filter((_, i) => i !== index));
		}
	}

	function updateGradientAngle(angle: number) {
		gradientAngle.set(angle);
	}
</script>

<div class={cn('space-y-4 overflow-hidden')}>
	{#if $backgroundType === 'solid'}
		<div class="space-y-3 overflow-hidden">
			<div class="flex items-center gap-3">
				<input
					type="color"
					bind:value={$backgroundColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="h-8 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
				/>
				<input
					type="text"
					bind:value={$backgroundColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#8564FA]/50"
					placeholder="#8564FA"
				/>
			</div>
		</div>
	{:else}
		<div class="space-y-4 overflow-hidden">
			{#if $backgroundType === 'linear'}
				<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
					<Slider
						value={$gradientAngle}
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
					{#each $gradientStops as stop, index (`${index}-${stop.color}-${stop.position}`)}
						<div class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/20 p-3">
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
									class="w-14 rounded-md border border-zinc-700 bg-zinc-900/50 px-2 py-1 text-center text-xs text-white focus:border-[#8564FA]/50 focus:outline-none focus:ring-1 focus:ring-[#8564FA]/50"
								/>
								<span class="text-xs text-zinc-500">%</span>
							</div>
							{#if $gradientStops.length > 2}
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

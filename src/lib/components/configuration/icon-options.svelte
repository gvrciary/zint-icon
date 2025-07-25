<script lang="ts">
	import { iconColor, iconSize, iconOffsetX, iconOffsetY, iconGlass, iconGlow } from '$lib/stores/icon';
	import Input from '$lib/components/ui/input.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
</script>

<div class="space-y-4 overflow-hidden">
	<div class="space-y-3 overflow-hidden">
		<div class="flex items-center gap-3">
			<input
				type="color"
				bind:value={$iconColor}
				class="h-8 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
			/>
			<Input type="text" bind:value={$iconColor} placeholder="#ffffff" class="min-w-0 flex-1" />
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
				value={$iconSize}
				min={20}
				max={512}
				step={1}
				label="Size"
				onChange={(value) => iconSize.set(value)}
			/>
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
				value={$iconOffsetX}
				min={-256}
				max={256}
				step={1}
				label="Offset X"
				onChange={(value) => iconOffsetX.set(value)}
			/>
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
			    value={$iconOffsetY}
				min={-256}
				max={256}
				step={1}
				label="Offset Y"
				onChange={(value) => iconOffsetY.set(value)}
			/>
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-zinc-300">Glass</span>
				<label class="relative inline-flex cursor-pointer items-center">
					<input
						type="checkbox"
						bind:checked={$iconGlass}
						class="peer sr-only"
					/>
					<div class="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#8564FA] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8564FA]/50"></div>
				</label>
			</div>
		</div>
	</div>
	
	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<div class="flex items-center justify-between">
				<span class="text-sm text-zinc-300">Glow</span>
				<label class="relative inline-flex cursor-pointer items-center">
					<input
						type="checkbox"
						bind:checked={$iconGlow}
						class="peer sr-only"
					/>
					<div class="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#8564FA] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8564FA]/50"></div>
				</label>
			</div>
		</div>
	</div>
</div>

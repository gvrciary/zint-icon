<script lang="ts">
	import {
		selectedIcon,
		iconColor,
		iconSize,
		iconOffsetX,
		iconOffsetY,
		iconGlass,
		iconGlow,
		customContentType
	} from '$lib/stores/icon';
	import Input from '$lib/components/ui/input.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
</script>

<div class="space-y-6 overflow-hidden">
	{#if !($selectedIcon === 'Custom' && $customContentType === 'png')}
		<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
			<div class="mb-3">
				<span class="text-sm font-medium text-gray-300">Icon Color</span>
			</div>
			<div class="flex items-center gap-3">
				<input
					type="color"
					bind:value={$iconColor}
					class="h-10 w-14 flex-shrink-0 cursor-pointer rounded-xl border border-[#333] bg-transparent transition-colors hover:border-white/30"
				/>
				<Input type="text" bind:value={$iconColor} placeholder="#ffffff" class="min-w-0 flex-1" />
			</div>
		</div>
	{/if}

	<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
		<Slider
			value={$iconSize}
			min={20}
			max={512}
			step={1}
			label="Size"
			onChange={(value) => iconSize.set(value)}
		/>
	</div>

	<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
		<Slider
			value={$iconOffsetX}
			min={-256}
			max={256}
			step={1}
			label="Offset X"
			onChange={(value) => iconOffsetX.set(value)}
		/>
	</div>

	<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
		<Slider
			value={$iconOffsetY}
			min={-256}
			max={256}
			step={1}
			label="Offset Y"
			onChange={(value) => iconOffsetY.set(value)}
		/>
	</div>

	{#if !($selectedIcon === 'Custom' && $customContentType === 'png')}
		<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
			<Input type="checkbox" bind:value={$iconGlass} label="Glass Effect" />
		</div>

		<div class="rounded-2xl border border-[#333] bg-[#1f1f1f57] p-4 backdrop-blur-sm">
			<Input type="checkbox" bind:value={$iconGlow} label="Glow Effect" />
		</div>
	{/if}
</div>

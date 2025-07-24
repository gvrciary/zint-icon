<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		label?: string;
		showValue?: boolean;
		class?: string;
		onChange?: (value: number) => void;
	}

	let {
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		label = '',
		showValue = true,
		class: className = '',
		onChange,
		...restProps
	}: Props = $props();

	let sliderRef: HTMLInputElement;
	let animationId: number | null = null;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		value = newValue;

		if (animationId) {
			cancelAnimationFrame(animationId);
		}

		animationId = requestAnimationFrame(() => {
			onChange?.(newValue);
			animationId = null;
		});
	}

	const percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={cn('flex items-center gap-3', className)} {...restProps}>
	{#if label}
		<span class="min-w-fit text-sm text-zinc-300">{label}</span>
	{/if}

	<div class="relative flex-1">
		<div class="relative h-3 overflow-hidden rounded-full bg-zinc-800">
			<div
				class="absolute left-0 top-0 h-full rounded-full bg-[#8564FA] transition-all duration-200"
				style="width: {percentage}%"
			></div>
		</div>
		<input
			bind:this={sliderRef}
			type="range"
			{min}
			{max}
			{step}
			{disabled}
			bind:value
			oninput={handleInput}
			class="absolute inset-0 h-3 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
			style="will-change: transform;"
		/>
	</div>

	{#if showValue}
		<span class="min-w-[2rem] text-right font-mono text-sm text-zinc-400">
			{Math.round(value)}
		</span>
	{/if}
</div>

<style>
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 10;
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		border: none;
	}

	input[type='range']::-moz-range-track {
		background: transparent;
		border: none;
	}

	input[type='range']:disabled::-webkit-slider-thumb,
	input[type='range']:disabled::-moz-range-thumb {
		background: rgb(113 113 122);
		cursor: not-allowed;
	}
</style>

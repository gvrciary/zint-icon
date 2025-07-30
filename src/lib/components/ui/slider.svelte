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

<div class={cn('space-y-3', className)} {...restProps}>
	<div class="flex items-center justify-between">
		{#if label}
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
		{/if}
		{#if showValue}
			<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.round(value)}</span>
		{/if}
	</div>

	<div class="relative">
		<div
			class="relative h-3 overflow-hidden rounded-full border border-black/10 bg-black/5 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
		>
			<div
				class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-black/80 via-black/90 to-black/70 transition-all duration-200 ease-out dark:from-white/80 dark:via-white/90 dark:to-white/70"
				style="width: {percentage}%"
			>
				<div
					class="absolute inset-0 rounded-full bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent"
				></div>
			</div>
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
</div>

<style>
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: linear-gradient(135deg, #374151, #6b7280);
		cursor: pointer;
		border: 2px solid rgba(55, 65, 81, 0.8);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 10;
	}

	.dark input[type='range']::-webkit-slider-thumb {
		background: linear-gradient(135deg, #ffffff, #e5e7eb);
		border: 2px solid rgba(255, 255, 255, 0.8);
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: linear-gradient(135deg, #374151, #6b7280);
		cursor: pointer;
		border: 2px solid rgba(55, 65, 81, 0.8);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
	}

	.dark input[type='range']::-moz-range-thumb {
		background: linear-gradient(135deg, #ffffff, #e5e7eb);
		border: 2px solid rgba(255, 255, 255, 0.8);
	}

	input[type='range']::-moz-range-track {
		background: transparent;
		border: none;
		height: 12px;
	}

	input[type='range']::-webkit-slider-track {
		background: transparent;
		border: none;
		height: 12px;
	}

	input[type='range']:disabled {
		opacity: 0.5;
	}

	input[type='range']:disabled::-webkit-slider-thumb,
	input[type='range']:disabled::-moz-range-thumb {
		background: rgb(113 113 122);
		cursor: not-allowed;
	}

	input[type='range']:focus {
		outline: none;
	}

	input[type='range']:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.3);
		outline-offset: 2px;
	}
</style>

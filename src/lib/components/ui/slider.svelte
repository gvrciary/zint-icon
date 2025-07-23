<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		class?: string;
		onChange?: (value: number) => void;
	}

	let {
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		class: className = '',
		onChange,
		...restProps
	}: Props = $props();

	let sliderRef: HTMLInputElement;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		value = newValue;
		onChange?.(newValue);
	}

	const percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={cn('relative w-full', className)} {...restProps}>
	<input
		bind:this={sliderRef}
		type="range"
		{min}
		{max}
		{step}
		{disabled}
		bind:value
		oninput={handleInput}
		class="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 outline-none transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
		style="background: linear-gradient(to right, #8564FA 0%, #8564FA {percentage}%, rgb(39 39 42) {percentage}%, rgb(39 39 42) 100%)"
	/>
</div>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px 0 rgba(133, 100, 250, 0.3);
	}

	.slider::-webkit-slider-thumb:active {
		transform: scale(1.05);
	}

	.slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #8564fa;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		transition: all 0.2s ease;
	}

	.slider::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px 0 rgba(133, 100, 250, 0.3);
	}

	.slider::-moz-range-thumb:active {
		transform: scale(1.05);
	}

	.slider::-moz-range-track {
		height: 8px;
		background: transparent;
		border: none;
	}

	.slider:disabled::-webkit-slider-thumb,
	.slider:disabled::-moz-range-thumb {
		background: rgb(113 113 122);
		cursor: not-allowed;
		transform: none;
	}

	.slider:disabled::-webkit-slider-thumb:hover,
	.slider:disabled::-moz-range-thumb:hover {
		transform: none;
		box-shadow: none;
	}
</style>

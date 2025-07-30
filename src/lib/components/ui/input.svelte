<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		type?: 'text' | 'number' | 'checkbox';
		value?: string | number | boolean;
		placeholder?: string;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		label?: string;
		class?: string;
		oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
		onchange?: (event: Event & { currentTarget: HTMLInputElement }) => void;
		onfocus?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
		onblur?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
	}

	let {
		type = 'text',
		value = $bindable(),
		placeholder = '',
		min,
		max,
		step,
		disabled = false,
		label = '',
		class: className = '',
		oninput,
		onchange,
		onfocus,
		onblur
	}: Props = $props();

	const effectiveMin = $derived(type === 'number' ? (min ?? 1) : min);
	const effectiveMax = $derived(type === 'number' ? (max ?? 2048) : max);

	const isChecked = $derived(type === 'checkbox' ? Boolean(value) : false);

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		const target = event.currentTarget;

		if (type === 'checkbox') {
			value = target.checked;
		} else if (type === 'number') {
			let inputValue = target.value.replace(/[^0-9.-]/g, '');

			const parts = inputValue.split('.');
			if (parts.length > 2) {
				inputValue = parts[0] + '.' + parts.slice(1).join('');
			}

			if (inputValue.includes('-')) {
				const minusCount = (inputValue.match(/-/g) || []).length;
				if (minusCount > 1 || (inputValue.indexOf('-') !== 0 && inputValue.includes('-'))) {
					inputValue = inputValue.replace(/-/g, '');
					if (inputValue.charAt(0) !== '-' && target.value.charAt(0) === '-') {
						inputValue = '-' + inputValue;
					}
				}
			}

			target.value = inputValue;
			value = inputValue === '' ? '' : parseFloat(inputValue) || 0;
		} else {
			value = target.value;
		}

		if (oninput) {
			oninput(event);
		}
	}

	function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
		const target = event.currentTarget;

		if (type === 'checkbox') {
			value = target.checked;
		} else if (type === 'number') {
			let numValue = parseFloat(target.value);

			if (isNaN(numValue)) {
				numValue = 0;
			}

			if (effectiveMin !== undefined && numValue < effectiveMin) {
				numValue = effectiveMin;
			}
			if (effectiveMax !== undefined && numValue > effectiveMax) {
				numValue = effectiveMax;
			}

			target.value = numValue.toString();
			value = numValue;
		}

		if (onchange) {
			onchange(event);
		}
	}

	function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (type === 'number') {
			if ([8, 9, 27, 13, 46, 35, 36, 37, 39, 38, 40].includes(event.keyCode)) {
				return;
			}
			if ((event.ctrlKey || event.metaKey) && [65, 67, 86, 88, 90].includes(event.keyCode)) {
				return;
			}
			if (event.key === '.' || event.key === '-') {
				return;
			}
			if (
				(event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
				(event.keyCode < 96 || event.keyCode > 105)
			) {
				event.preventDefault();
			}
		}
	}
</script>

{#if type === 'checkbox'}
	<div class={cn('flex items-center justify-between', className)}>
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
		<label class="relative inline-flex cursor-pointer items-center">
			<input
				type="checkbox"
				checked={isChecked}
				{disabled}
				oninput={handleInput}
				onchange={handleChange}
				{onfocus}
				{onblur}
				class="peer sr-only"
			/>

			<div
				class="relative h-6 w-11 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm transition-all duration-200 peer-checked:border-black/20 peer-checked:bg-black/10 peer-focus-visible:ring-1 peer-focus-visible:ring-black/20 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-white dark:border-[#333] dark:bg-[#1f1f1f57] dark:peer-checked:border-white/30 dark:peer-checked:bg-white/10 dark:peer-focus-visible:ring-white/20 dark:peer-focus-visible:ring-offset-zinc-900"
			></div>

			<div
				class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-600 shadow-sm transition-all duration-200 ease-out peer-checked:translate-x-5 peer-checked:from-black peer-checked:via-zinc-900 peer-checked:to-zinc-800 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 dark:peer-checked:from-white dark:peer-checked:via-gray-100 dark:peer-checked:to-gray-200"
			>
				<div
					class="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/40 to-transparent"
				></div>
			</div>
		</label>
	</div>
{:else}
	<div class="group relative">
		<div
			class="relative overflow-hidden rounded-2xl border border-black/10 bg-black/5 p-[1px] backdrop-blur-sm transition-all duration-200 group-focus-within:border-black/20 group-focus-within:bg-black/10 dark:border-[#333] dark:bg-[#1f1f1f57] dark:group-focus-within:border-white/30 dark:group-focus-within:bg-white/5"
		>
			<div class="relative overflow-hidden rounded-[15px] bg-transparent">
				<div
					class="group-focus-within:via-black/3 dark:group-focus-within:via-white/3 absolute inset-0 rounded-[15px] bg-gradient-to-br from-gray-200/10 via-gray-300/5 to-gray-400/10 group-focus-within:from-black/5 group-focus-within:to-black/5 dark:from-zinc-600/10 dark:via-zinc-700/5 dark:to-zinc-800/10 dark:group-focus-within:from-white/5 dark:group-focus-within:to-white/5"
				></div>

				<input
					{type}
					bind:value
					{placeholder}
					min={effectiveMin}
					max={effectiveMax}
					{step}
					{disabled}
					oninput={handleInput}
					onchange={handleChange}
					onkeydown={handleKeydown}
					{onfocus}
					{onblur}
					class={cn(
						'relative z-10 w-full bg-transparent px-4 py-3 text-sm font-medium text-gray-800 transition-all duration-200 placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500',
						'focus:outline-none focus:ring-0',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'autofill:bg-transparent autofill:text-gray-800 dark:autofill:text-gray-200',
						className
					)}
				/>

				<div
					class="pointer-events-none absolute inset-0 rounded-[15px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
				></div>
			</div>
		</div>

		<div
			class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-black/30 ring-offset-1 ring-offset-transparent transition-opacity duration-200 group-focus-within:opacity-100 dark:ring-white/30"
		></div>
	</div>
{/if}

<style>
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.05) inset !important;
		-webkit-text-fill-color: rgb(31 41 55) !important;
		transition: background-color 5000s ease-in-out 0s;
	}

	.dark input:-webkit-autofill,
	.dark input:-webkit-autofill:hover,
	.dark input:-webkit-autofill:focus,
	.dark input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px rgba(31, 31, 31, 0.34) inset !important;
		-webkit-text-fill-color: rgb(229 231 235) !important;
	}

	input:focus {
		outline: none;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>

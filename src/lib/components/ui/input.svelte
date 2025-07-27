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

			if (min !== undefined && numValue < min) {
				numValue = min;
			}
			if (max !== undefined && numValue > max) {
				numValue = max;
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
		<span class="text-sm font-medium text-gray-300">{label}</span>
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
				class="relative h-6 w-11 rounded-full border border-[#333] bg-[#1f1f1f57] backdrop-blur-sm transition-all duration-200 peer-checked:border-white/30 peer-checked:bg-white/10 peer-focus-visible:ring-1 peer-focus-visible:ring-white/20 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-zinc-900"
			></div>

			<div
				class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 shadow-sm transition-all duration-200 ease-out peer-checked:translate-x-5 peer-checked:from-white peer-checked:via-gray-100 peer-checked:to-gray-200"
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
			class="relative overflow-hidden rounded-2xl border border-[#333] bg-[#1f1f1f57] p-[1px] backdrop-blur-sm transition-all duration-200 group-focus-within:border-white/30 group-focus-within:bg-white/5"
		>
			<div class="relative overflow-hidden rounded-[15px] bg-transparent">
				<div
					class="group-focus-within:via-white/3 absolute inset-0 rounded-[15px] bg-gradient-to-br from-zinc-600/10 via-zinc-700/5 to-zinc-800/10 group-focus-within:from-white/5 group-focus-within:to-white/5"
				></div>

				<input
					{type}
					bind:value
					{placeholder}
					{min}
					{max}
					{step}
					{disabled}
					oninput={handleInput}
					onchange={handleChange}
					onkeydown={handleKeydown}
					{onfocus}
					{onblur}
					class={cn(
						'relative z-10 w-full bg-transparent px-4 py-3 text-sm font-medium text-gray-200 transition-all duration-200 placeholder:text-gray-500',
						'focus:outline-none focus:ring-0',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'autofill:bg-transparent autofill:text-gray-200',
						className
					)}
				/>

				<div
					class="pointer-events-none absolute inset-0 rounded-[15px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
				></div>
			</div>
		</div>

		<div
			class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/30 ring-offset-1 ring-offset-transparent transition-opacity duration-200 group-focus-within:opacity-100"
		></div>
	</div>
{/if}

<style>
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px rgba(31, 31, 31, 0.34) inset !important;
		-webkit-text-fill-color: rgb(229 231 235) !important;
		transition: background-color 5000s ease-in-out 0s;
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

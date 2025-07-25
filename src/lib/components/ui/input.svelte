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
		<span class="text-sm text-zinc-300">{label}</span>
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
				class="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#8564FA] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8564FA]/50"
			></div>
		</label>
	</div>
{:else}
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
			'w-full rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white transition-colors placeholder:text-zinc-500',
			'focus:border-[#8564FA]/50 focus:outline-none focus:ring-2 focus:ring-[#8564FA]/50',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'hover:border-zinc-700',
			className
		)}
	/>
{/if}

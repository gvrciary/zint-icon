<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';

	interface Option {
		label: string;
		value: string;
	}

	interface Props {
		options: Option[];
		value?: string;
		placeholder?: string;
		class?: string;
		onSelect?: (value: string) => void;
	}

	let {
		options,
		value = '',
		placeholder = 'Select option',
		class: className = '',
		onSelect,
		...restProps
	}: Props = $props();

	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(optionValue: string) {
		value = optionValue;
		isOpen = false;
		onSelect?.(optionValue);
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	const selectedOption = $derived(options.find(option => option.value === value));
</script>

<svelte:window on:click={handleClickOutside} />

<div bind:this={dropdownRef} class={cn('relative', className)} {...restProps}>
	<button
		type="button"
		class="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm bg-black/20 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors backdrop-blur-sm text-white"
		onclick={toggleDropdown}
	>
		<span class={cn('truncate', !selectedOption && 'text-zinc-400')}>
			{selectedOption?.label || placeholder}
		</span>
		<ChevronDown
			class={cn('w-4 h-4 transition-transform text-zinc-400', isOpen && 'rotate-180')}
		/>
	</button>

	{#if isOpen}
		<div class="absolute top-full left-0 right-0 mt-1 z-50 bg-black/90 border border-zinc-800 rounded-lg backdrop-blur-sm shadow-2xl overflow-hidden">
			{#each options as option, key (key)}
				<button
					type="button"
					class={cn(
						'w-full px-4 py-2.5 text-sm text-left hover:bg-zinc-800/50 transition-colors',
						option.value === value ? 'bg-zinc-800/30 text-white' : 'text-zinc-300'
					)}
					onclick={() => selectOption(option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';

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

	const selectedOption = $derived(options.find((option) => option.value === value));
</script>

<svelte:window on:click={handleClickOutside} />

<div bind:this={dropdownRef} class={cn('relative', className)} {...restProps}>
	<Button
		variant="secondary"
		size="md"
		class="w-full justify-between px-4 py-2.5"
		onclick={toggleDropdown}
	>
		<span class={cn('truncate', !selectedOption && 'text-zinc-400')}>
			{selectedOption?.label || placeholder}
		</span>
		<ChevronDown class={cn('h-4 w-4 text-zinc-400 transition-transform', isOpen && 'rotate-180')} />
	</Button>

	{#if isOpen}
		<div
			class="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-zinc-800 bg-black/90 shadow-2xl backdrop-blur-sm"
		>
			{#each options as option, key (key)}
				<Button
					variant="secondary"
					size="md"
					class={cn(
						'w-full justify-start rounded-none border-none px-4 py-2.5 text-left hover:bg-zinc-800/50',
						option.value === value ? 'bg-zinc-800/30 text-white' : 'bg-transparent text-zinc-300'
					)}
					onclick={() => selectOption(option.value)}
				>
					{option.label}
				</Button>
			{/each}
		</div>
	{/if}
</div>

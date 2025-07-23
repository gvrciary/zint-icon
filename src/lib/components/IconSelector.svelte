<script lang="ts">
	import { cn } from '$lib/utils';
	import { Search } from 'lucide-svelte';
	import { AVAILABLE_ICONS, ICON_NAMES } from '$lib/data/icons';
	import Button from './ui/button.svelte';

	interface Props {
		selectedIcon?: string;
		onSelect?: (iconName: string) => void;
		class?: string;
	}

	let { selectedIcon = 'Star', onSelect, class: className = '', ...restProps }: Props = $props();

	let searchQuery = $state('');

	const filteredIcons = $derived(() => {
		if (!searchQuery.trim()) return ICON_NAMES;
		return ICON_NAMES.filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()));
	});

	function selectIcon(iconName: string) {
		selectedIcon = iconName;
		onSelect?.(iconName);
	}
</script>

<div class={cn('flex h-full flex-col', className)} {...restProps}>
	<div class="flex-shrink-0 border-b border-white/5 p-4">
		<div class="relative">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search icons..."
				class="w-full rounded-lg border border-zinc-800 bg-black/20 py-2.5 pr-4 pl-10 text-sm text-white transition-colors placeholder:text-zinc-500 focus:border-transparent focus:ring-2 focus:ring-[#8564FA]/50 focus:outline-none"
			/>
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<div class="grid grid-cols-4 gap-2">
			{#each filteredIcons() as iconName (iconName)}
				<Button
					variant="secondary"
					size="sm"
					onclick={() => selectIcon(iconName)}
					title={iconName}
					class={cn(
						'group !flex-col !p-3 hover:!bg-zinc-800/30',
						selectedIcon === iconName
							? '!border-[#8564FA] !bg-[#8564FA]/10'
							: '!border-zinc-800 hover:!border-zinc-700'
					)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						class={cn(
							'transition-colors',
							selectedIcon === iconName
								? 'text-[#8564FA]'
								: 'text-zinc-400 group-hover:text-zinc-300'
						)}
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d={AVAILABLE_ICONS[iconName]} />
					</svg>

					<span
						class={cn(
							'mt-1.5 w-full truncate text-center text-xs transition-colors',
							selectedIcon === iconName
								? 'text-[#8564FA]'
								: 'text-zinc-500 group-hover:text-zinc-400'
						)}
					>
						{iconName}
					</span>
				</Button>
			{/each}
		</div>

		{#if filteredIcons().length === 0}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<Search class="mb-4 h-12 w-12 text-zinc-600" />
				<p class="text-sm text-zinc-400">No icons found</p>
				<p class="mt-1 text-xs text-zinc-600">Try a different search term</p>
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Search, ShuffleIcon } from 'lucide-svelte';
	import { AVAILABLE_ICONS, getIconSvg, ICON_NAMES, getRandomIcon } from '$lib/data/icons';
	import Button from '$lib/components/ui/button.svelte';
	import { selectedIcon, customSvg, customPng, customContentType } from '$lib/stores/icon';
	import { Upload } from 'lucide-svelte';

	function selectRandomIcon() {
		const randomIcon = getRandomIcon();
		selectedIcon.set(randomIcon);
	}

	const availableIcons = $derived(() => {
		const names = [...ICON_NAMES];
		if ($customSvg.trim() || $customPng.trim()) {
			names.unshift('Custom');
		}
		return names;
	});

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			if (file.type === 'image/svg+xml') {
				const reader = new FileReader();
				reader.onload = (e) => {
					const svgContent = e.target?.result as string;
					customSvg.set(svgContent);
					customPng.set('');
					customContentType.set('svg');
					selectedIcon.set('Custom');
				};
				reader.readAsText(file);
			} else if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const pngContent = e.target?.result as string;
					customPng.set(pngContent);
					customSvg.set('');
					customContentType.set('png');
					selectedIcon.set('Custom');
				};
				reader.readAsDataURL(file);
			}
		}
		target.value = '';
	}

	let fileInput: HTMLInputElement;

	let searchQuery = $state('');

	const filteredIcons = $derived(() => {
		if (!searchQuery.trim()) return availableIcons();
		return availableIcons().filter((name) =>
			name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});
</script>

<div class="flex h-full flex-1 flex-col overflow-hidden">
	<div class="flex-shrink-0 border-b border-white/5 p-4">
		<div class="mb-4 flex gap-2">
			<Button
				variant="secondary"
				size="sm"
				onclick={selectRandomIcon}
				class="!text-zinc-300 hover:!border-[#8564FA] hover:!bg-[#8564FA]/10 hover:!text-[#8564FA]"
			>
				<ShuffleIcon class="h-4 w-4" />
			</Button>

			<Button
				variant="secondary"
				size="sm"
				onclick={() => fileInput.click()}
				class="!text-zinc-300 hover:!border-[#8564FA] hover:!bg-[#8564FA]/10 hover:!text-[#8564FA]"
			>
				<Upload class="h-4 w-4" />
			</Button>

			<input
				bind:this={fileInput}
				type="file"
				accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
				onchange={handleFileUpload}
				class="hidden"
			/>
		</div>

		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-zinc-500" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search icons..."
				class="w-full rounded-lg border border-zinc-800 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white transition-colors placeholder:text-zinc-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#8564FA]/50"
			/>
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<div class="grid grid-cols-4 gap-2">
			{#each filteredIcons() as iconName (iconName)}
				<Button
					variant="secondary"
					size="sm"
					onclick={() => selectedIcon.set(iconName)}
					title={iconName}
					class={cn(
						'group !flex-col !p-3 hover:!bg-zinc-800/30',
						$selectedIcon === iconName
							? '!border-[#8564FA] !bg-[#8564FA]/10'
							: '!border-zinc-800 hover:!border-zinc-700'
					)}
				>
					<div
						class={cn(
							'h-10 w-5 transition-colors [&>svg]:h-full [&>svg]:w-full',
							$selectedIcon === iconName
								? 'text-[#8564FA] [&>svg]:stroke-[#8564FA]'
								: 'text-zinc-400 group-hover:text-zinc-300 [&>svg]:stroke-zinc-400 group-hover:[&>svg]:stroke-zinc-300'
						)}
					>
						{#if iconName === 'Custom'}
							{#if $customContentType === 'png'}
								<img src={$customPng} alt="Custom" class="h-full w-full object-contain" />
							{:else}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html getIconSvg(iconName, $customSvg, $customPng, $customContentType)}
							{/if}
						{:else}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html AVAILABLE_ICONS[iconName]}
						{/if}
					</div>
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

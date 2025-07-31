<script lang="ts">
	import { cn } from '$lib/utils';
	import { Search, ShuffleIcon } from 'lucide-svelte';
	import { AVAILABLE_ICONS, getIconSvg, ICON_NAMES, getRandomIcon } from '$lib/data/icons';
	import Button from '$lib/components/ui/button.svelte';
	import { Upload } from 'lucide-svelte';
	import { selectedIcon, customSvg, customPng, customContentType } from '$lib/stores/icon';
	import { toast } from 'svelte-sonner';

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
				toast.success('SVG icon uploaded successfully!');
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
				toast.success('Image icon uploaded successfully!');
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

<div class="flex h-full flex-1 flex-col space-y-6 overflow-hidden">
	<div
		class="rounded-2xl border border-black/10 bg-black/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
	>
		<div class="relative mb-5 flex items-center gap-2">
			<div class="relative flex-1">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search icons..."
					class="w-full rounded-full border border-black/10  bg-white/5 py-2.5 pl-10 pr-4 text-sm text-gray-700 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 focus:border-black/20 focus:outline-none focus:ring-0 dark:border-[#333] dark:bg-[rgba(31,31,31,0.62)] dark:text-gray-300 dark:placeholder:text-gray-500 dark:focus:border-white/30"
				/>
			</div>

			<Button
				variant="glass-icon"
				size="sm"
				onclick={selectRandomIcon}
				title="Random Icon"
				class="h-10 w-10"
			>
				<ShuffleIcon class="h-4 w-4" />
			</Button>

			<Button
				variant="glass-icon"
				size="sm"
				onclick={() => fileInput.click()}
				title="Upload Icon"
				class="h-10 w-10"
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

		<div class="max-h-64 overflow-y-auto">
			<div class="grid grid-cols-4 gap-3">
				{#each filteredIcons() as iconName (iconName)}
					<Button
						variant="glass-nav"
						size="sm"
						onclick={() => selectedIcon.set(iconName)}
						title={iconName}
						class={cn(
							'group flex flex-col items-center justify-center p-3',
							$selectedIcon === iconName ? '!border-white/30 !bg-white/10 shadow-lg' : ''
						)}
					>
						<div
							class={cn(
								'h-8 w-8 transition-colors [&>svg]:h-full [&>svg]:w-full',
								$selectedIcon === iconName
									? ' dark:text-white [&>svg]:stroke-black dark:[&>svg]:stroke-white'
									: ' dark:text-gray-400 dark:group-hover:text-gray-300 [&>svg]:stroke-gray-700 dark:[&>svg]:stroke-gray-400 dark:group-hover:[&>svg]:stroke-gray-300'
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
					<Search class="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
					<p class="text-sm text-gray-600 dark:text-gray-400">No icons found</p>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-600">Try a different search term</p>
				</div>
			{/if}
		</div>
	</div>
</div>

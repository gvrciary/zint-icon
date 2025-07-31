<script lang="ts">
	import { Menu, Download, ChevronDown } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import CopyButton from '$lib/components/ui/copy-button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import {
		downloadResolution
	} from '$lib/stores/icon';
	import { onMount } from 'svelte';
	import { createICOFile, generateImageDataFromSVG } from '$lib/parser/ico';
	import { toast } from 'svelte-sonner';
	import { getCompleteSVG } from '$lib/parser/svg';

	let isMobileMenuOpen = $state(false);
	let isDownloadDropdownOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	onMount(() => {
		function handleClickOutside(event: Event) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isDownloadDropdownOpen = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function toggleDownloadDropdown() {
		isDownloadDropdownOpen = !isDownloadDropdownOpen;
	}

	let svgContent = $state('');

	async function exportSVG() {
		toast.promise(getCompleteSVG(), {
			loading: 'Generating SVG...',
			success: (svgData) => {
				const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
				const url = URL.createObjectURL(svgBlob);

				const link = document.createElement('a');
				link.download = `zin-icon.svg`;
				link.href = url;
				link.click();

				URL.revokeObjectURL(url);
				return 'SVG generated successfully!';
			},
			error: () => `Failed to generate SVG`
		});
	}

	async function exportPNG() {
		try {
			const svgData = await getCompleteSVG();
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();
			const resolution = $downloadResolution || 512;
			canvas.width = resolution;
			canvas.height = resolution;

			const png = new Promise<void>((resolve, reject) => {
				img.onload = function () {
					try {
						if (ctx) {
							ctx.drawImage(img, 0, 0, resolution, resolution);
							const link = document.createElement('a');
							link.download = `zin-icon-${resolution}x${resolution}.png`;
							link.href = canvas.toDataURL('image/png');
							link.click();
							URL.revokeObjectURL(url);
							resolve();
						}
					} catch (error) {
						URL.revokeObjectURL(url);
						reject(error);
					}
				};

				img.onerror = function () {
					URL.revokeObjectURL(url);
					reject(new Error('Failed to load SVG image'));
				};

				const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
				const url = URL.createObjectURL(svgBlob);
				img.src = url;
			});

			toast.promise(png, {
				loading: 'Generating PNG...',
				success: () => {
					return 'PNG generated successfully!';
				},
				error: () => `Failed to generate PNG`
			});
		} catch {
			toast.error('Failed to export PNG');
		}
	}

	async function exportICO() {
		try {
			const svgData = await getCompleteSVG();
			const sizes = [16, 32, 48, 64, 128, 256];

			toast.promise(generateImageDataFromSVG(svgData, sizes), {
				loading: 'Generating ICO...',
				success: (images) => {
					const icoData = createICOFile(images, sizes);
					const blob = new Blob([icoData], { type: 'image/x-icon' });
					const url = URL.createObjectURL(blob);

					const link = document.createElement('a');
					link.download = `zin-icon.ico`;
					link.href = url;
					link.click();

					URL.revokeObjectURL(url);
					return 'ICO generated successfully!';
				},
				error: () => `Failed to generate ICO`
			});
		} catch {
			toast.error('Failed to export ICO');
		}
	}
</script>

<header class="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
	<div class="px-4 py-3 md:px-6 md:py-4">
		<nav class="flex items-center justify-between">
			<a href="/" class="group flex items-center space-x-3">
				<div class="relative h-8 w-8 overflow-hidden">
					<img src="/icon.svg" alt="Zin Icon Logo" class="h-full w-full object-cover" />
				</div>
				<div class="items-center gap-2 hidden md:flex">
					<span class="text-xl text-black dark:text-white">ZintIcon</span>
					<span
						class="rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57] dark:text-gray-300"
						>beta</span
					>
				</div>
			</a>

			<div class="hidden items-center gap-2 md:flex">
				<ThemeToggle />

				<CopyButton text={svgContent} />

				<div class="relative" bind:this={dropdownRef}>
					<Button variant="glass" size="md" onclick={toggleDownloadDropdown} title="Download">
						<Download class="h-4 w-4" />
						Download
						<ChevronDown class="ml-1 h-3 w-3" />
					</Button>

					{#if isDownloadDropdownOpen}
						<div
							class="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-black/10 bg-black/5 shadow-2xl backdrop-blur-md dark:border-[#333] dark:bg-[#1f1f1f57]"
						>
							<div
								class="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
							>
								<button
									class="cursor-pointer text-left text-sm text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white"
									onclick={async () => {
										await exportPNG();
										isDownloadDropdownOpen = false;
									}}
								>
									PNG
								</button>
								<Input
									type="number"
									bind:value={$downloadResolution}
									placeholder="512"
									class="h-7 w-20 text-xs"
								/>
							</div>
							<button
								class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
								onclick={() => {
									exportSVG();
									isDownloadDropdownOpen = false;
								}}
							>
								SVG
							</button>
							<button
								class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
								onclick={() => {
									exportICO();
									isDownloadDropdownOpen = false;
								}}
							>
								ICO
							</button>
						</div>
					{/if}
				</div>
			</div>

			<button class="text-black md:hidden dark:text-white" onclick={toggleMobileMenu} tabindex="0">
				<Menu class="h-6 w-6" />
			</button>
		</nav>
	</div>

	{#if isMobileMenuOpen}
		<div
			class="border-t border-black/10 bg-black/5 backdrop-blur-md md:hidden dark:border-[#333] dark:bg-[#1f1f1f57]"
		>
			<div class="px-4 py-3 md:px-6">
				<div class="flex gap-2">
					<ThemeToggle />

					<CopyButton text={svgContent} class="flex-1" />

					<div class="relative flex-1">
						<Button variant="glass" size="md" onclick={toggleDownloadDropdown} class="w-full">
							<Download class="h-4 w-4" />
							Download
							<ChevronDown class="ml-1 h-3 w-3" />
						</Button>

						{#if isDownloadDropdownOpen}
							<div
								class="absolute right-0 top-full z-50 mt-2 w-full rounded-2xl border border-black/10 bg-black/5 shadow-2xl backdrop-blur-md dark:border-[#333] dark:bg-[#1f1f1f57]"
							>
								<button
									class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
									onclick={() => {
										exportSVG();
										isDownloadDropdownOpen = false;
									}}
								>
									SVG
								</button>
								<div
									class="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
								>
									<button
										class="cursor-pointer text-left text-sm text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white"
										onclick={async () => {
											await exportPNG();
											isDownloadDropdownOpen = false;
										}}
									>
										PNG
									</button>
									<Input
										type="number"
										bind:value={$downloadResolution}
										placeholder="512"
										class="h-7 w-20 text-xs"
									/>
								</div>
								<button
									class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
									onclick={() => {
										exportICO();
										isDownloadDropdownOpen = false;
									}}
								>
									ICO
								</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>

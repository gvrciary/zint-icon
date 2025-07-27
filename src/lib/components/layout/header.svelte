<script lang="ts">
	import { Menu, Download, ChevronDown } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import CopyButton from '$lib/components/ui/copy-button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import {
		selectedIcon,
		iconColor,
		iconSize,
		iconOffsetX,
		iconOffsetY,
		iconGlass,
		iconGlow,
		customSvg,
		customPng,
		customContentType,
		borderRadius,
		borderStroke,
		borderColor,
		borderOpacity,
		background3D,
		background3DRotation,
		meshGradientColors,
		noise,
		contrast,
		saturation,
		brightness,
		downloadResolution
	} from '$lib/stores/icon';
	import { getProcessedSvg } from '$lib/parser/svg';
	import { initRender } from '$lib/webgl/mesh-render';
	import vertexShader from '$lib/utils/shaders/shaders.vert?raw';
	import fragmentShader from '$lib/utils/shaders/shaders.frag?raw';
	import { onMount } from 'svelte';
	import { createICOFile } from '$lib/parser/ico';

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

	async function getCompleteSVG(): Promise<string> {
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = 512;
		tempCanvas.height = 512;

		const render = initRender(tempCanvas, vertexShader, fragmentShader, {
			meshGradientColors: $meshGradientColors,
			noise: $noise,
			contrast: $contrast,
			saturation: $saturation,
			brightness: $brightness
		});

		render();

		const backgroundImageData = tempCanvas.toDataURL('image/png');

		const iconSvg = await getProcessedSvg(
			$selectedIcon,
			{
				iconGlow: $iconGlow,
				iconGlass: $iconGlass,
				iconColor: $iconColor,
				iconSize: $iconSize,
				iconOffsetX: $iconOffsetX,
				iconOffsetY: $iconOffsetY
			},
			$customSvg,
			$customPng,
			$customContentType
		);

		const borderStrokeStyle = (() => {
			const opacity = $borderOpacity / 100;
			const r = parseInt($borderColor.slice(1, 3), 16);
			const g = parseInt($borderColor.slice(3, 5), 16);
			const b = parseInt($borderColor.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${opacity})`;
		})();

		let defs = '';
		let backgroundElements = '';
		let borderElement = '';

		defs += `
			<clipPath id="borderClip">
				<rect width="512" height="512" rx="${$borderRadius}" ry="${$borderRadius}" />
			</clipPath>
		`;

		backgroundElements = `<image href="${backgroundImageData}" width="512" height="512" clip-path="url(#borderClip)" />`;

		if ($background3D) {
			defs += `
				<linearGradient
					id="edge3D"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
					gradientTransform="rotate(${$background3DRotation})"
				>
					<stop offset="0%" style="stop-color:rgba(255,255,255,0.5);stop-opacity:1" />
					<stop offset="30%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
					<stop offset="70%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
					<stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
				</linearGradient>
				<filter id="edge3DBlur" x="-10%" y="-10%" width="120%" height="120%">
					<feGaussianBlur stdDeviation="2" result="blurred" />
				</filter>
			`;

			backgroundElements += `
				<rect
					width="512"
					height="512"
					rx="${$borderRadius}"
					ry="${$borderRadius}"
					fill="none"
					stroke="url(#edge3D)"
					stroke-width="20"
					filter="url(#edge3DBlur)"
					clip-path="url(#borderClip)"
				/>
			`;
		}

		if ($borderStroke > 0) {
			borderElement = `
				<rect
					width="512"
					height="512"
					rx="${$borderRadius}"
					ry="${$borderRadius}"
					fill="none"
					stroke="${borderStrokeStyle}"
					stroke-width="${$borderStroke}"
				/>
			`;
		}

		const iconContent = iconSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>$/, '');

		return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			${defs ? `<defs>${defs}</defs>` : ''}
			${backgroundElements}
			${borderElement}
			${iconContent}
		</svg>`;
	}

	let svgContent = $state('');

	$effect(() => {
		(async () => {
			try {
				svgContent = await getCompleteSVG();
			} catch (err) {
				console.error('Error generating SVG:', err);
			}
		})();
	});

	async function exportSVG() {
		try {
			const svgData = await getCompleteSVG();
			const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);

			const link = document.createElement('a');
			link.download = `zin-icon.svg`;
			link.href = url;
			link.click();

			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to download SVG:', err);
		}
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

			img.onload = function () {
				if (ctx) {
					ctx.drawImage(img, 0, 0, resolution, resolution);
					const link = document.createElement('a');
					link.download = `zin-icon.png`;
					link.href = canvas.toDataURL();
					link.click();
				}
			};

			const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(svgBlob);
			img.src = url;
		} catch (err) {
			console.error('Failed to export PNG:', err);
		}
	}

	async function exportICO() {
		try {
			const svgData = await getCompleteSVG();
			const sizes = [16, 32, 48, 64, 128, 256];
			const images: ImageData[] = [];

			for (const size of sizes) {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				const img = new Image();

				canvas.width = size;
				canvas.height = size;

				await new Promise<void>((resolve) => {
					img.onload = () => {
						if (ctx) {
							ctx.drawImage(img, 0, 0, size, size);
							const imageData = ctx.getImageData(0, 0, size, size);
							images.push(imageData);
						}
						resolve();
					};

					const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
					const url = URL.createObjectURL(svgBlob);
					img.src = url;
				});
			}

			const icoData = createICOFile(images, sizes);
			const blob = new Blob([icoData], { type: 'image/x-icon' });
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.download = `zin-icon.ico`;
			link.href = url;
			link.click();

			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to export ICO:', err);
		}
	}
</script>

<header class="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
	<div class="px-4 py-4 md:px-6 md:py-6">
		<nav class="flex items-center justify-between">
			<a href="/" class="group flex items-center space-x-3">
				<div class="relative h-8 w-8 overflow-hidden">
					<img src="/logo.svg" alt="Zin Icon Logo" class="h-full w-full object-cover" />
				</div>
				<span class="font-mono text-xl text-white">ZintIcon</span>
			</a>

			<div class="hidden items-center gap-2 md:flex">
				<CopyButton text={svgContent} />

				<div class="relative" bind:this={dropdownRef}>
					<Button variant="primary" size="md" onclick={toggleDownloadDropdown} title="Download">
						<Download class="h-4 w-4" />
						Download
						<ChevronDown class="ml-1 h-3 w-3" />
					</Button>

					{#if isDownloadDropdownOpen}
						<div
							class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-700 bg-gray-800 shadow-lg"
						>
							<div class="flex items-center gap-2 px-3 py-2 hover:bg-gray-700">
								<button
									class="text-left text-sm text-white"
									onclick={() => {
										exportPNG();
										isDownloadDropdownOpen = false;
									}}
								>
									PNG
								</button>
								<Input
									type="number"
									bind:value={$downloadResolution}
									placeholder="512"
									class="h-6 w-16 text-xs"
								/>
							</div>
							<button
								class="w-full rounded-t-md px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
								onclick={() => {
									exportSVG();
									isDownloadDropdownOpen = false;
								}}
							>
								SVG
							</button>
							<button
								class="w-full rounded-b-md px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
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

			<button class="text-white md:hidden" onclick={toggleMobileMenu} tabindex="0">
				<Menu class="h-6 w-6" />
			</button>
		</nav>
	</div>

	{#if isMobileMenuOpen}
		<div class="border-t border-white/5 bg-black/90 backdrop-blur-sm md:hidden">
			<div class="px-4 py-4 md:px-6">
				<div class="flex gap-2">
					<CopyButton text={svgContent} class="flex-1" />

					<div class="relative flex-1">
						<Button variant="primary" size="md" onclick={toggleDownloadDropdown} class="w-full">
							<Download class="h-4 w-4" />
							Download
							<ChevronDown class="ml-1 h-3 w-3" />
						</Button>

						{#if isDownloadDropdownOpen}
							<div
								class="absolute right-0 top-full z-50 mt-1 w-full rounded-md border border-gray-700 bg-gray-800 shadow-lg"
							>
								<button
									class="w-full rounded-t-md px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
									onclick={() => {
										exportSVG();
										isDownloadDropdownOpen = false;
									}}
								>
									SVG
								</button>
								<div class="flex items-center gap-2 px-3 py-2 hover:bg-gray-700">
									<button
										class="flex-1 text-left text-sm text-white"
										onclick={() => {
											exportPNG();
											isDownloadDropdownOpen = false;
										}}
									>
										PNG
									</button>
									<Input
										type="text"
										bind:value={$downloadResolution}
										placeholder="512"
										class="h-6 w-16 text-xs"
									/>
								</div>
								<button
									class="w-full rounded-b-md px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
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

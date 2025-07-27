<script lang="ts">
	import { Menu, Palette, Download, ChevronDown } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import CopyButton from '$lib/components/ui/copy-button.svelte';
	import {
		selectedIcon,
		iconColor,
		iconSize,
		iconOffsetX,
		iconOffsetY,
		iconGlass,
		iconGlow,
		customSvg,
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
		brightness
	} from '$lib/stores/icon';
	import { getProcessedSvg } from '$lib/parser/svg';
	import { initRender } from '$lib/webgl/mesh-render';
	import vertexShader from '$lib/utils/shaders/shaders.vert?raw';
	import fragmentShader from '$lib/utils/shaders/shaders.frag?raw';
	import { onMount } from 'svelte';

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
			$customSvg
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
			link.download = `${$selectedIcon}-icon.svg`;
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

			canvas.width = 512;
			canvas.height = 512;

			img.onload = function () {
				if (ctx) {
					ctx.drawImage(img, 0, 0);
					const link = document.createElement('a');
					link.download = `${$selectedIcon}-icon.png`;
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
			link.download = `${$selectedIcon}-icon.ico`;
			link.href = url;
			link.click();

			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to export ICO:', err);
		}
	}

	function createICOFile(images: ImageData[], sizes: number[]): ArrayBuffer {
		const header = new ArrayBuffer(6);
		const headerView = new DataView(header);
		headerView.setUint16(0, 0, true);
		headerView.setUint16(2, 1, true);
		headerView.setUint16(4, images.length, true);

		const dirEntries = new ArrayBuffer(16 * images.length);
		const dirView = new DataView(dirEntries);

		let imageDataOffset = 6 + 16 * images.length;
		const imageDataArray: ArrayBuffer[] = [];

		for (let i = 0; i < images.length; i++) {
			const size = sizes[i];
			const imageData = images[i];

			const bmpData = createBMPFromImageData(imageData, size);
			imageDataArray.push(bmpData);

			const offset = i * 16;
			dirView.setUint8(offset + 0, size === 256 ? 0 : size);
			dirView.setUint8(offset + 1, size === 256 ? 0 : size);
			dirView.setUint8(offset + 2, 0);
			dirView.setUint8(offset + 3, 0);
			dirView.setUint16(offset + 4, 1, true);
			dirView.setUint16(offset + 6, 32, true);
			dirView.setUint32(offset + 8, bmpData.byteLength, true);
			dirView.setUint32(offset + 12, imageDataOffset, true);

			imageDataOffset += bmpData.byteLength;
		}

		const totalSize =
			6 + 16 * images.length + imageDataArray.reduce((sum, data) => sum + data.byteLength, 0);
		const result = new ArrayBuffer(totalSize);
		const resultView = new Uint8Array(result);

		resultView.set(new Uint8Array(header), 0);

		resultView.set(new Uint8Array(dirEntries), 6);

		let offset = 6 + 16 * images.length;
		for (const imageData of imageDataArray) {
			resultView.set(new Uint8Array(imageData), offset);
			offset += imageData.byteLength;
		}

		return result;
	}

	function createBMPFromImageData(imageData: ImageData, size: number): ArrayBuffer {
		const width = size;
		const height = size;
		const imageSize = width * height * 4;
		const fileSize = 40 + imageSize;

		const buffer = new ArrayBuffer(fileSize);
		const view = new DataView(buffer);

		view.setUint32(0, 40, true);
		view.setInt32(4, width, true);
		view.setInt32(8, height * 2, true);
		view.setUint16(12, 1, true);
		view.setUint16(14, 32, true);
		view.setUint32(16, 0, true);
		view.setUint32(20, imageSize, true);
		view.setInt32(24, 0, true);
		view.setInt32(28, 0, true);
		view.setUint32(32, 0, true);
		view.setUint32(36, 0, true);

		const pixels = new Uint8Array(buffer, 40);
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const srcIndex = ((height - 1 - y) * width + x) * 4;
				const dstIndex = (y * width + x) * 4;

				pixels[dstIndex + 0] = imageData.data[srcIndex + 2];
				pixels[dstIndex + 1] = imageData.data[srcIndex + 1];
				pixels[dstIndex + 2] = imageData.data[srcIndex + 0];
				pixels[dstIndex + 3] = imageData.data[srcIndex + 3];
			}
		}

		return buffer;
	}
</script>

<header class="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
	<div class="px-4 py-4 md:px-6 md:py-6">
		<nav class="flex items-center justify-between">
			<a href="/" class="group flex items-center space-x-3">
				<div class="relative h-8 w-8 overflow-hidden">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8564FA]">
						<Palette class="h-5 w-5 text-white" />
					</div>
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						style="transform: translateX(-100%);"
					></div>
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
							class="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-gray-700 bg-gray-800 shadow-lg"
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
							<button
								class="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
								onclick={() => {
									exportPNG();
									isDownloadDropdownOpen = false;
								}}
							>
								PNG
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
								<button
									class="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
									onclick={() => {
										exportPNG();
										isDownloadDropdownOpen = false;
									}}
								>
									PNG
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
			</div>
		</div>
	{/if}
</header>

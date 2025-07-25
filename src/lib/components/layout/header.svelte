<script lang="ts">
	import { cn } from '$lib/utils';
	import { Menu, Palette, Download } from 'lucide-svelte';
	import { getIconPath } from '$lib/data/icons';
	import Button from '$lib/components/ui/button.svelte';
	import {
		selectedIcon,
		backgroundType,
		backgroundColor,
		iconColor
	} from '$lib/stores/icon';
	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function createSVG() {
		const iconPath = getIconPath($selectedIcon);

		let gradientDef = '';
		let fillValue = $backgroundColor;

		return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
			${gradientDef}
			<rect width="512" height="512" rx="24" ry="24" fill="${fillValue}"/>
			<g transform="translate(256, 256)">
				<g transform="scale(8) translate(-12, -12)">
					<path d="${iconPath}" fill="none" stroke="${$iconColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</g>
			</g>
		</svg>`;
	}

	function downloadSVG() {
		const svgData = createSVG();
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		const link = document.createElement('a');
		link.download = `${$selectedIcon}-icon.svg`;
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	}

	function exportPNG() {
		const svgData = createSVG();
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
	}
</script>

<header class={cn('fixed left-0 right-0 top-0 z-50 transition-all duration-300')}>
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
				<span class="font-mono text-xl text-white">icon maker</span>
			</a>

			<div class="hidden items-center gap-2 md:flex">
				<Button variant="download" size="md" onclick={downloadSVG} title="Download SVG">
					<Download class="h-4 w-4" />
					SVG
				</Button>

				<Button variant="primary" size="md" onclick={exportPNG} title="Export PNG">
					<Download class="h-4 w-4" />
					PNG
				</Button>
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
					<Button variant="download" size="md" onclick={downloadSVG} class="flex-1">
						<Download class="h-4 w-4" />
						SVG
					</Button>

					<Button variant="primary" size="md" onclick={exportPNG} class="flex-1">
						<Download class="h-4 w-4" />
						PNG
					</Button>
				</div>
			</div>
		</div>
	{/if}
</header>

<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import IconSelector from '$lib/components/IconSelector.svelte';
	import IconPreview from '$lib/components/IconPreview.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import Dropdown from '$lib/components/ui/dropdown.svelte';
	import { cn } from '$lib/utils';
	import { DEFAULT_ICON } from '$lib/data/icons';
	import Button from '$lib/components/ui/button.svelte';

	interface GradientStop {
		color: string;
		position: number;
	}

	let selectedIcon = $state(DEFAULT_ICON);
	let backgroundType: 'solid' | 'linear' | 'radial' = $state('solid');
	let backgroundColor = $state('#8564FA');
	let gradientStops: GradientStop[] = $state([
		{ color: '#8564FA', position: 0 },
		{ color: '#FF6B6B', position: 100 }
	]);
	let gradientAngle = $state(45);
	let iconColor = $state('#ffffff');

	const backgroundOptions = [
		{ label: 'Solid', value: 'solid' },
		{ label: 'Linear', value: 'linear' },
		{ label: 'Radial', value: 'radial' }
	];

	const iconColorOptions = [
		'#ffffff',
		'#000000',
		'#8564FA',
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#96CEB4',
		'#FFEAA7',
		'#DDA0DD',
		'#98D8C8',
		'#F7DC6F',
		'#BB8FCE'
	];

	function handleIconSelect(iconName: string) {
		selectedIcon = iconName;
	}

	function handleBackgroundTypeChange(type: string) {
		backgroundType = type as 'solid' | 'linear' | 'radial';
	}

	function handleBackgroundColorChange(config: {
		type: 'solid' | 'linear' | 'radial';
		solidColor?: string;
		gradientStops?: GradientStop[];
		gradientAngle?: number;
	}) {
		if (config.solidColor) {
			backgroundColor = config.solidColor;
		}
		if (config.gradientStops) {
			gradientStops = config.gradientStops;
		}
		if (config.gradientAngle !== undefined) {
			gradientAngle = config.gradientAngle;
		}
	}

	function handleIconColorSelect(color: string) {
		iconColor = color;
	}
</script>

<Header
	{selectedIcon}
	{backgroundType}
	{backgroundColor}
	{gradientStops}
	{gradientAngle}
	{iconColor}
/>

<main class="h-screen overflow-hidden pt-20 md:pt-24">
	<div class="h-full px-4 md:px-6">
		<div
			class="grid h-[calc(100vh-5rem)] grid-cols-1 gap-6 md:h-[calc(100vh-6rem)] lg:grid-cols-12"
		>
			<aside
				class="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm lg:col-span-3"
			>
				<div class="border-b border-white/5 p-4">
					<h2 class="text-lg font-medium text-white">Icons</h2>
					<p class="mt-1 text-sm text-zinc-400">Choose from Lucide icons</p>
				</div>
				<IconSelector {selectedIcon} onSelect={handleIconSelect} class="flex-1 overflow-hidden" />
			</aside>

			<section class="flex h-full items-center justify-center overflow-hidden py-8 lg:col-span-6">
				<IconPreview
					{selectedIcon}
					{backgroundType}
					{backgroundColor}
					{gradientStops}
					{gradientAngle}
					{iconColor}
				/>
			</section>

			<aside
				class="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm lg:col-span-3"
			>
				<div class="border-b border-white/5 p-4">
					<h2 class="text-lg font-medium text-white">Settings</h2>
					<p class="mt-1 text-sm text-zinc-400">Customize your icon</p>
				</div>

				<div class="flex-1 space-y-6 overflow-y-auto p-4">
					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Background Type </label>
						<Dropdown
							options={backgroundOptions}
							value={backgroundType}
							onSelect={handleBackgroundTypeChange}
						/>
					</div>

					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Background </label>
						<ColorPicker
							type={backgroundType}
							solidColor={backgroundColor}
							bind:gradientStops
							{gradientAngle}
							onChange={handleBackgroundColorChange}
						/>
					</div>

					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Icon Color </label>
						<div class="flex items-center gap-3">
							<div
								class="h-8 w-8 rounded-lg border border-zinc-700"
								style="background: {iconColor}"
							></div>
							<input
								type="color"
								bind:value={iconColor}
								oninput={(e) => handleIconColorSelect(e.currentTarget.value)}
								class="h-8 w-12 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
							/>
							<input
								type="text"
								bind:value={iconColor}
								oninput={(e) => handleIconColorSelect(e.currentTarget.value)}
								class="flex-1 rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#8564FA]/50 focus:outline-none"
								placeholder="#ffffff"
							/>
						</div>

						<div class="grid grid-cols-6 gap-2">
							{#each iconColorOptions as color (color)}
								<Button
									variant="secondary"
									size="sm"
									onclick={() => handleIconColorSelect(color)}
									aria-label={`Select color ${color}`}
									class={cn(
										'!h-8 !w-8 border-2 !p-0 transition-all hover:scale-110',
										iconColor.toLowerCase() === color.toLowerCase()
											? 'border-white'
											: 'border-zinc-700 hover:border-zinc-500'
									)}
									style="background: {color}"
								></Button>
							{/each}
						</div>
					</div>
				</div>
			</aside>
		</div>
	</div>
</main>

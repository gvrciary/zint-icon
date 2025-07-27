<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import IconSelector from '$lib/components/icon/icon-selector.svelte';
	import Preview from '$lib/components/icon/preview.svelte';
	import BackgroundOptions from '$lib/components/configuration/background-options.svelte';
	import IconOptions from '$lib/components/configuration/icon-options.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { FlameIcon, ImageIcon } from 'lucide-svelte';

	let activeAside: 'icons' | 'options' = 'icons';
</script>

<Header />

<main class="min-h-screen select-none overflow-hidden pt-16 md:pt-20">
	<div class="h-full px-4 md:px-6">
		<div class="hidden h-[calc(100vh-6rem)] grid-cols-12 gap-6 lg:grid">
			<aside
				class="col-span-3 flex h-full flex-col overflow-hidden rounded-2xl border border-[#333] bg-[#1f1f1f57] backdrop-blur-sm"
			>
				<div class="flex-1 space-y-6 overflow-y-auto p-6">
					<span class="block text-sm font-medium text-gray-300"> Icons </span>
					
					<div class="space-y-4">
						<IconSelector />
					</div>

					<div class="space-y-4">
						<IconOptions />
					</div>
				</div>
			</aside>

			<section class="col-span-6 flex h-full items-center justify-center overflow-hidden py-8">
				<Preview />
			</section>

			<aside
				class="col-span-3 flex h-full flex-col overflow-hidden rounded-2xl border border-[#333] bg-[#1f1f1f57] backdrop-blur-sm"
			>
				<div class="flex-1 space-y-6 overflow-y-auto p-6">
					<div class="space-y-4">
						<span class="block text-sm font-medium text-gray-300"> Background </span>
						<BackgroundOptions />
					</div>
				</div>
			</aside>
		</div>

		<div class="flex h-[calc(100vh-5rem)] flex-col md:h-[calc(100vh-6rem)] lg:hidden">
			<section class="flex flex-1 items-center justify-center overflow-hidden py-4">
				<div class="scale-50 sm:scale-75">
					<Preview />
				</div>
			</section>

			<aside
				class="flex flex-1 flex-col overflow-hidden rounded-t-2xl border border-[#333] bg-[#1f1f1f57] backdrop-blur-sm"
			>
				<div class="{activeAside === 'icons' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden">
					<div class="flex-1 space-y-6 overflow-y-auto p-6">
						<div class="space-y-4">
							<IconSelector />
						</div>

						<div class="space-y-4">
							<IconOptions />
						</div>
					</div>
				</div>

				<div
					class="{activeAside === 'options' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden"
				>
					<div class="flex-1 space-y-6 overflow-y-auto p-6">
						<div class="space-y-4">
							<label for="" class="block text-sm font-medium text-gray-300"> Background </label>
							<BackgroundOptions />
						</div>
					</div>
				</div>
			</aside>

			<nav
				class="flex gap-2 rounded-t-2xl border-t border-[#333] bg-[#1f1f1f57] p-2 backdrop-blur-sm"
			>
				<Button
					variant="glass"
					size="sm"
					class="flex-1 flex-col gap-1 py-4 {activeAside === 'icons'
						? '!border-white/20 !bg-white/10 !text-white'
						: ''}"
					onclick={() => (activeAside = 'icons')}
				>
					<FlameIcon class="h-5 w-5" />
					<span class="text-xs font-medium">Icon</span>
				</Button>
				<Button
					variant="glass"
					size="sm"
					class="flex-1 flex-col gap-1 py-4 {activeAside === 'options'
						? '!border-white/20 !bg-white/10 !text-white'
						: ''}"
					onclick={() => (activeAside = 'options')}
				>
					<ImageIcon class="h-5 w-5" />
					<span class="text-xs font-medium">Background</span>
				</Button>
			</nav>
		</div>
	</div>
</main>

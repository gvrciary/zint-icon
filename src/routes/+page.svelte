<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import IconSelector from '$lib/components/icon/icon-selector.svelte';
	import Preview from '$lib/components/icon/preview.svelte';
	import BackgroundOptions from '$lib/components/configuration/background-options.svelte';
	import IconOptions from '$lib/components/configuration/icon-options.svelte';
	import { ImageIcon, Settings2 } from 'lucide-svelte';

	let activeAside: 'icons' | 'options' = 'icons';
</script>

<Header />

<main class="min-h-screen select-none overflow-hidden pt-20 md:pt-24">
	<div class="h-full px-4 md:px-6">
		<!-- Desktop Layout -->
		<div class="hidden h-[calc(100vh-6rem)] grid-cols-12 gap-6 lg:grid">
			<aside
				class="col-span-3 flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm"
			>
				<IconSelector />
			</aside>

			<section class="col-span-6 flex h-full items-center justify-center overflow-hidden py-8">
				<Preview />
			</section>

			<aside
				class="col-span-3 flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm"
			>
				<div class="flex-1 space-y-6 overflow-y-auto p-4">
					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Background </label>
						<BackgroundOptions />
					</div>

					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Icon </label>
						<IconOptions />
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
				class="flex flex-1 flex-col overflow-hidden rounded-t-xl border border-white/5 bg-black/20 backdrop-blur-sm"
			>
				<div class="{activeAside === 'icons' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden">
					<IconSelector />
				</div>

				<div
					class="{activeAside === 'options' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden"
				>
					<div class="flex-1 space-y-6 overflow-y-auto p-4">
						<div class="space-y-3">
							<label for="" class="block text-sm font-medium text-zinc-300"> Background </label>
							<BackgroundOptions />
						</div>

						<div class="space-y-3">
							<label for="" class="block text-sm font-medium text-zinc-300"> Icon </label>
							<IconOptions />
						</div>
					</div>
				</div>
			</aside>

			<nav class="flex border-t border-white/5 bg-black/20 backdrop-blur-sm">
				<button
					class="flex-1 px-6 py-4 text-center transition-colors {activeAside === 'icons'
						? 'bg-white/10 text-white'
						: 'text-zinc-400 hover:bg-white/5 hover:text-white'}"
					on:click={() => (activeAside = 'icons')}
				>
					<div class="flex flex-col items-center gap-1">
						<ImageIcon class="h-5 w-5" />
						<span class="text-xs font-medium">Icons</span>
					</div>
				</button>
				<button
					class="flex-1 px-6 py-4 text-center transition-colors {activeAside === 'options'
						? 'bg-white/10 text-white'
						: 'text-zinc-400 hover:bg-white/5 hover:text-white'}"
					on:click={() => (activeAside = 'options')}
				>
					<div class="flex flex-col items-center gap-1">
						<Settings2 class="h-5 w-5" />
						<span class="text-xs font-medium">Options</span>
					</div>
				</button>
			</nav>
		</div>
	</div>
</main>

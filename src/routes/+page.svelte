<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import IconSelector from '$lib/components/icon/icon-selector.svelte';
	import Preview from '$lib/components/icon/preview.svelte';
	import BackgroundOptions from '$lib/components/configuration/background-options.svelte';
	import Dropdown from '$lib/components/ui/dropdown.svelte';
	import IconOptions from '$lib/components/configuration/icon-options.svelte';
	import { backgroundOptions } from '$lib/constants';
	import { backgroundType } from '$lib/stores/icon';
</script>

<Header />

<main class="min-h-screen overflow-hidden pt-20 md:pt-24">
	<div class="h-full px-4 md:px-6">
		<div
			class="grid h-[calc(100vh-5rem)] grid-cols-1 gap-6 md:h-[calc(100vh-6rem)] lg:grid-cols-12"
		>
			<aside
				class="flex h-full flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm lg:col-span-3"
			>
				<div class="border-b border-white/5 p-4">
					<h2 class="text-lg font-medium text-white">Icons</h2>
				</div>
				<IconSelector />
			</aside>

			<section class="flex h-full items-center justify-center overflow-hidden py-8 lg:col-span-6">
				<Preview />
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
							value={$backgroundType}
							onSelect={(type: string) => backgroundType.set(type as 'solid' | 'linear' | 'radial')}
						/>
					</div>

					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Background </label>
						<BackgroundOptions />
					</div>

					<div class="space-y-3">
						<label for="" class="block text-sm font-medium text-zinc-300"> Icon Color </label>
						<IconOptions />
					</div>
				</div>
			</aside>
		</div>
	</div>
</main>

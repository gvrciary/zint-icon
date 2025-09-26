<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import IconSelector from '$lib/components/icon/icon-selector.svelte';
  import Preview from '$lib/components/icon/preview.svelte';
  import BackgroundOptions from '$lib/components/configuration/background-options.svelte';
  import IconOptions from '$lib/components/configuration/icon-options.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { ImageIcon, PencilIcon } from 'lucide-svelte';

  let activeAside: 'icon' | 'background' = 'icon';
</script>

<Header />

<main class="min-h-dvh select-none overflow-hidden px-4 pt-16 md:px-6 md:pt-20">
  <div class="hidden h-[calc(100dvh-6rem)] gap-6 md:flex">
    <aside
      class="flex h-full flex-[0_0_320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-black/5 backdrop-blur-sm md:max-w-[270px] lg:min-w-80 dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <IconSelector />
        <IconOptions />
      </div>
    </aside>

    <section class="flex h-full flex-1 items-center justify-center overflow-hidden py-8">
      <div class="md:scale-50 lg:scale-75 xl:scale-100">
        <Preview />
      </div>
    </section>

    <aside
      class="flex h-full flex-[0_0_320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-black/5 backdrop-blur-sm md:max-w-[270px] lg:min-w-80 dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <BackgroundOptions />
      </div>
    </aside>
  </div>

  <div class="flex h-[calc(100vh-5rem)] flex-col md:hidden">
    <section class="flex flex-1 items-center justify-center overflow-hidden py-8">
      <div class="scale-50 sm:scale-75">
        <Preview />
      </div>
    </section>

    <aside
      class="flex flex-1 flex-col overflow-hidden rounded-t-2xl border border-black/10 bg-black/5 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="{activeAside === 'icon' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden">
        <div class="flex-1 space-y-4 overflow-y-auto p-6">
          <IconSelector />
          <IconOptions />
        </div>
      </div>

      <div
        class="{activeAside === 'background' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden"
      >
        <div class="flex-1 space-y-6 overflow-y-auto p-6">
          <div class="space-y-4">
            <BackgroundOptions />
          </div>
        </div>
      </div>
    </aside>

    <nav
      class="flex gap-2 rounded-t-2xl border-t border-black/10 bg-black/5 p-2 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <Button
        variant="glass"
        size="sm"
        class="flex-1 flex-col gap-1 py-4 {activeAside === 'icon'
          ? '!border-black/20 !bg-black/5 !text-black dark:!border-white/20 dark:!bg-white/10 dark:!text-white'
          : ' bg-gray-100/5'}"
        onclick={() => (activeAside = 'icon')}
      >
        <PencilIcon class="h-5 w-5" />
        <span class="text-xs font-medium">Icon</span>
      </Button>
      <Button
        variant="glass"
        size="sm"
        class="flex-1 flex-col gap-1 py-4 {activeAside === 'background'
          ? '!border-black/20 !bg-black/5 !text-black dark:!border-white/20 dark:!bg-white/10 dark:!text-white'
          : ' bg-gray-100/5'}"
        onclick={() => (activeAside = 'background')}
      >
        <ImageIcon class="h-5 w-5" />
        <span class="text-xs font-medium">Background</span>
      </Button>
    </nav>
  </div>
</main>

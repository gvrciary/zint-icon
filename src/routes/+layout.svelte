<script lang="ts">
  import '$lib/styles/global.css';
  import { ModeWatcher, mode } from 'mode-watcher';
  import { Toaster } from 'svelte-sonner';

  let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
<Toaster
  theme={mode.current === 'dark' ? 'dark' : 'light'}
  position="bottom-right"
  class="toaster"
  toastOptions={{
    unstyled: true,
    classes: {
      toast: `
        flex gap-2 p-4 rounded-xl text-sm border border-black/10 dark:border-[#333]
        shadow-md backdrop-blur-md
        bg-black/5 dark:bg-[#1f1f1f57] bg-opacity-70 dark:bg-opacity-70
        text-gray-800 dark:text-gray-300
      `,
      description: 'text-gray-700 dark:text-zinc-300'
    }
  }}
/>

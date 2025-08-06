<script lang="ts">
  import { Sun, Moon } from 'lucide-svelte';
  import { mode, toggleMode } from 'mode-watcher';
  import Button from '$lib/components/ui/button.svelte';

  interface Props {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { size = 'md', class: className = '' }: Props = $props();
</script>

<Button
  variant="glass-icon"
  {size}
  class={className}
  onclick={toggleMode}
  title={mode.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  aria-label={mode.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if mode.current === 'dark'}
    <Sun class="h-4 w-4" />
  {:else}
    <Moon class="h-4 w-4" />
  {/if}
</Button>

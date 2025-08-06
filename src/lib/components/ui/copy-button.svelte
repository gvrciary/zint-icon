<script lang="ts">
  import { Copy, Check } from 'lucide-svelte';
  import Button from './button.svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    text: string;
    size?: 'sm' | 'md' | 'lg';
    class?: string;
    disabled?: boolean;
  }

  let { text, size = 'md', class: className = '', disabled = false }: Props = $props();

  let copied = $state(false);
  let timeoutId: number;

  async function handleCopy() {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      toast.success('Copied to clipboard!');
      timeoutId = setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }

  $effect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });
</script>

<Button
  variant="glass"
  {size}
  {disabled}
  title={copied ? 'Copied!' : 'Copy'}
  class={className}
  onclick={handleCopy}
>
  <div class="relative flex items-center justify-center">
    <div
      class="transition-all duration-200 ease-in-out {copied
        ? 'rotate-45 scale-0 opacity-0'
        : 'rotate-0 scale-100 opacity-100'}"
    >
      <Copy class="h-4 w-4" />
    </div>

    <div
      class="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out {copied
        ? 'rotate-0 scale-100 opacity-100'
        : '-rotate-45 scale-0 opacity-0'}"
    >
      <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
    </div>
  </div>
</Button>

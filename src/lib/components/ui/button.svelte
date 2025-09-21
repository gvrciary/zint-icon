<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'glass' | 'glass-icon' | 'glass-nav';
    size?: 'sm' | 'md' | 'lg';
    class?: string;
    disabled?: boolean;
    onclick?: () => void;
    title?: string;
    'aria-label'?: string;
    style?: string;
    children?: Snippet;
  }

  let {
    variant = 'glass',
    size = 'md',
    class: className = '',
    disabled = false,
    onclick,
    title,
    'aria-label': ariaLabel,
    style,
    children,
    ...restProps
  }: Props = $props();

  const baseClasses =
    'group relative cursor-pointer border-none font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap';

  const variantClasses = {
    glass:
      'rounded-2xl border border-black/10 dark:border-[#333] bg-black/5 dark:bg-[#1f1f1f57] backdrop-blur-sm transition-all duration-200 hover:border-black/20 dark:hover:border-white/30 hover:bg-black/10 dark:hover:bg-white/10',
    'glass-icon':
      'rounded-full border border-black/10 dark:border-[#333] bg-black/5 dark:bg-[rgba(31,31,31,0.62)] transition-all duration-200 hover:border-black/20 dark:hover:border-white/30 hover:bg-black/10 dark:hover:bg-white/10',
    'glass-nav':
      'rounded-xl border border-black/10 dark:border-[#333] bg-black/5 dark:bg-[rgba(31,31,31,0.62)] backdrop-blur-sm transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/5'
  };

  const innerClasses = {
    glass: 'text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white',
    'glass-icon': 'text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white',
    'glass-nav': 'text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
</script>

<button
  type="button"
  class={cn(
    baseClasses,
    variantClasses[variant],
    innerClasses[variant],
    sizeClasses[size],
    className
  )}
  {disabled}
  {onclick}
  {title}
  aria-label={ariaLabel}
  {style}
  {...restProps}
>
  {#if children}{@render children()}{/if}
</button>

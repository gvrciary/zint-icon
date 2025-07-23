<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'download';
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
		variant = 'primary',
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
		'ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-lg h-auto';

	const variantClasses = {
		primary: 'bg-[#8564FA] hover:bg-[#8564FA]/90 text-white border border-[#8564FA]',
		secondary:
			'hover:text-accent-foreground border border-zinc-800 bg-black/20 backdrop-blur-sm hover:bg-zinc-800/50 text-white',
		download: 'border border-zinc-700 bg-black/80 text-white backdrop-blur-sm hover:bg-black/90'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-xs',
		md: 'px-6 py-2 text-sm',
		lg: 'px-6 py-3 text-sm md:text-md'
	};
</script>

<button
	class={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
	{disabled}
	{onclick}
	{title}
	aria-label={ariaLabel}
	{style}
	{...restProps}
>
	{#if children}{@render children()}{/if}
</button>

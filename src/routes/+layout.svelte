<script lang="ts">
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-[#0B0C0E] text-white">
	{@render children()}
</div>

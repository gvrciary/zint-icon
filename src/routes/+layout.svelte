<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-[#0B0C0E] text-white">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		background: #0b0c0e;
		color: white;
	}

	:global(.container) {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(::-webkit-scrollbar) {
		width: 6px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgb(63, 63, 70);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgb(82, 82, 91);
	}
</style>

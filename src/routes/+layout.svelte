<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}

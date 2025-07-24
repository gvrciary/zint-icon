<script lang="ts">
    import { iconColor } from "$lib/stores/icon";
</script>

<div class="flex items-center gap-3">
	<input
		type="color"
		bind:value={$iconColor}
		class="h-8 w-12 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
	/>
	<input
		type="text"
		bind:value={$iconColor}
		class="flex-1 rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#8564FA]/50 focus:outline-none"
		placeholder="#ffffff"
	/>
</div>

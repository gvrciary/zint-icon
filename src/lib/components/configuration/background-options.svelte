<script lang="ts">
	import { Plus, Minus, RefreshCw } from 'lucide-svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import {
		backgroundType,
		backgroundColor,
		noise,
		borderRadius,
		borderStroke,
		borderColor,
		borderOpacity,
		meshGradientColors
	} from '$lib/stores/icon';

	function updateSolidColor(color: string) {
		backgroundColor.set(color);
	}

	function updateNoise(value: number) {
		noise.set(value);
	}

	function updateBorderRadius(value: number) {
		borderRadius.set(value);
	}

	function updateBorderStroke(value: number) {
		borderStroke.set(value);
	}

	function updateBorderColor(color: string) {
		borderColor.set(color);
	}

	function updateBorderOpacity(value: number) {
		borderOpacity.set(value);
	}

	function updateMeshGradientColor(index: number, color: string) {
		meshGradientColors.set(
			$meshGradientColors.map((item, i) => (i === index ? { ...item, color } : item))
		);
	}

	function generateRandomPosition() {
		return {
			x: Math.random() * 120 - 10,
			y: Math.random() * 120 - 10
		};
	}

	function addMeshGradientColor() {
		const { x, y } = generateRandomPosition();
		meshGradientColors.set([...$meshGradientColors, { color: '#8564FA', x, y }]);
	}

	function refreshMeshPositions() {
		meshGradientColors.set(
			$meshGradientColors.map((item) => ({
				...item,
				...generateRandomPosition()
			}))
		);
	}

	function removeMeshGradientColor(index: number) {
		if ($meshGradientColors.length > 1) {
			meshGradientColors.set($meshGradientColors.filter((_, i) => i !== index));
		}
	}
</script>

<div class="space-y-4 overflow-hidden">
	{#if $backgroundType === 'solid'}
		<div class="space-y-3 overflow-hidden">
			<div class="flex items-center gap-3">
				<input
					type="color"
					bind:value={$backgroundColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="h-8 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
				/>
				<Input
					type="text"
					bind:value={$backgroundColor}
					oninput={(e) => updateSolidColor(e.currentTarget.value)}
					class="min-w-0 flex-1"
					placeholder="#8564FA"
				/>
			</div>
		</div>
	{:else if $backgroundType === 'mesh'}
		<div class="space-y-4 overflow-hidden">
			<div class="space-y-3 overflow-hidden">
				<div class="flex items-center justify-between">
					<span class="text-sm text-zinc-300">Mesh Colors</span>
					<div class="flex gap-2">
						<Button variant="secondary" size="sm" onclick={refreshMeshPositions}>
							<RefreshCw class="h-3 w-3" />
							Refresh
						</Button>
						<Button variant="secondary" size="sm" onclick={addMeshGradientColor}>
							<Plus class="h-3 w-3" />
							Add
						</Button>
					</div>
				</div>

				<div class="max-h-48 space-y-2 overflow-y-auto">
					{#each $meshGradientColors as meshColor, index (index)}
						<div class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/20 p-3">
							<input
								type="color"
								bind:value={meshColor.color}
								oninput={(e) => updateMeshGradientColor(index, e.currentTarget.value)}
								class="h-6 w-8 flex-shrink-0 cursor-pointer rounded-md border border-zinc-700 bg-transparent"
							/>
							<Input
								type="text"
								bind:value={meshColor.color}
								oninput={(e) => updateMeshGradientColor(index, e.currentTarget.value)}
								class="min-w-0 flex-1 !rounded-md !border-zinc-700 !bg-zinc-900/50 !px-2 !py-1 !text-xs"
								placeholder="#000000"
							/>
							{#if $meshGradientColors.length > 1}
								<Button
									variant="secondary"
									size="sm"
									onclick={() => removeMeshGradientColor(index)}
									class="flex-shrink-0 !p-1 hover:!bg-red-500/20"
								>
									<Minus class="h-3 w-3 text-red-400" />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
				value={$noise}
				min={0}
				max={100}
				step={1}
				label="Noise"
				showValue={true}
				onChange={updateNoise}
			/>
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
				value={$borderRadius}
				min={0}
				max={300}
				step={1}
				label="Border Radius"
				showValue={true}
				onChange={updateBorderRadius}
			/>
		</div>
	</div>

	<div class="space-y-3 overflow-hidden">
		<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
			<Slider
				value={$borderStroke}
				min={0}
				max={20}
				step={1}
				label="Border Stroke"
				showValue={true}
				onChange={updateBorderStroke}
			/>
		</div>

		{#if $borderStroke > 0}
			<div class="space-y-3 overflow-hidden">
				<div class="flex items-center gap-3">
					<input
						type="color"
						bind:value={$borderColor}
						oninput={(e) => updateBorderColor(e.currentTarget.value)}
						class="h-8 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-transparent"
					/>
					<Input
						type="text"
						bind:value={$borderColor}
						oninput={(e) => updateBorderColor(e.currentTarget.value)}
						class="min-w-0 flex-1"
						placeholder="#ffffff"
					/>
				</div>
				<div class="rounded-lg border border-zinc-800 bg-black/10 p-3">
					<Slider
						value={$borderOpacity}
						min={0}
						max={100}
						step={1}
						label="Border Opacity"
						showValue={true}
						onChange={updateBorderOpacity}
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

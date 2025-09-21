<script lang="ts">
  import { Plus, Minus, RefreshCw } from 'lucide-svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Slider from '$lib/components/ui/slider.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import {
    noise,
    borderRadius,
    borderStroke,
    borderColor,
    borderOpacity,
    meshGradientColors,
    background3D,
    background3DRotation,
    contrast,
    saturation,
    brightness
  } from '$lib/stores/icon';
  import { generateRandomPosition } from '$lib/utils';
  import { debounce } from '$lib/utils/debounce';

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

  const debouncedUpdateBorderColor = debounce(updateBorderColor, 150);

  function updateBorderOpacity(value: number) {
    borderOpacity.set(value);
  }

  function updateMeshGradientColor(index: number, color: string) {
    meshGradientColors.set(
      $meshGradientColors.map((item, i) => (i === index ? { ...item, color } : item))
    );
  }

  const debouncedUpdateMeshGradientColor = debounce(updateMeshGradientColor, 150);

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

  function updateBackground3DRotation(value: number) {
    background3DRotation.set(value);
  }

  function updateContrast(value: number) {
    contrast.set(value);
  }

  function updateSaturation(value: number) {
    saturation.set(value);
  }

  function updateBrightness(value: number) {
    brightness.set(value);
  }
</script>

<div class="space-y-6 overflow-hidden">
  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <div class="mb-4 flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Palette</span>
      <div class="flex gap-2">
        <Button variant="glass" size="sm" onclick={refreshMeshPositions}>
          <RefreshCw class="h-3 w-3" />
        </Button>
        {#if $meshGradientColors.length < 6}
          <Button variant="glass" size="sm" onclick={addMeshGradientColor}>
            <Plus class="h-3 w-3" />
          </Button>
        {/if}
      </div>
    </div>

    <div class="max-h-80 space-y-3 overflow-y-auto">
      {#each $meshGradientColors as meshColor, index (index)}
        <div
          class="flex items-center gap-3 rounded-xl border border-black/20 bg-white/5 p-3 backdrop-blur-sm dark:border-[#333] dark:bg-black/5 justify-between"
        >
          <div class="flex flex-1 items-center gap-3 min-w-0">
              <input
                type="color"
                bind:value={meshColor.color}
                oninput={(e) => debouncedUpdateMeshGradientColor(index, e.currentTarget.value)}
                class="h-8 w-10 flex-shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent transition-colors hover:border-black/20 dark:border-[#333] dark:hover:border-white/30"
              />
              <Input
                type="text"
                bind:value={meshColor.color}
                oninput={(e) => debouncedUpdateMeshGradientColor(index, e.currentTarget.value)}
                class="min-w-0 flex-1"
                placeholder="#000000"
              />
          </div>
          {#if $meshGradientColors.length > 1}
            <Button
              variant="glass"
              size="sm"
              onclick={() => removeMeshGradientColor(index)}
              class="flex-shrink-0 bg-transparent !p-1 hover:!bg-red-500/30 dark:hover:!bg-red-500/20"
            >
              <Minus class="h-3 w-3 text-red-400" />
            </Button>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider value={$noise} min={0} max={100} step={1} label="Noise" onChange={updateNoise} />
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider
      value={$contrast}
      min={0}
      max={200}
      step={1}
      label="Contrast"
      onChange={updateContrast}
    />
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider
      value={$saturation}
      min={0}
      max={200}
      step={1}
      label="Saturation"
      onChange={updateSaturation}
    />
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider
      value={$brightness}
      min={0}
      max={200}
      step={1}
      label="Brightness"
      onChange={updateBrightness}
    />
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider
      value={$borderRadius}
      min={0}
      max={300}
      step={1}
      label="Border Radius"
      onChange={updateBorderRadius}
    />
  </div>

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Slider
      value={$borderStroke}
      min={0}
      max={20}
      step={1}
      label="Border Stroke"
      onChange={updateBorderStroke}
    />
  </div>

  {#if $borderStroke > 0}
    <div
      class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="mb-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Border Color</span>
      </div>
      <div class="flex items-center gap-3">
        <input
          type="color"
          bind:value={$borderColor}
          oninput={(e) => debouncedUpdateBorderColor(e.currentTarget.value)}
          class="h-10 w-14 flex-shrink-0 cursor-pointer rounded-xl border border-black/10 bg-transparent transition-colors hover:border-black/20 dark:border-[#333] dark:hover:border-white/30"
        />
        <Input
          type="text"
          bind:value={$borderColor}
          oninput={(e) => debouncedUpdateBorderColor(e.currentTarget.value)}
          class="min-w-0 flex-1"
          placeholder="#ffffff"
        />
      </div>
    </div>

    <div
      class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <Slider
        value={$borderOpacity}
        min={0}
        max={100}
        step={1}
        label="Border Opacity"
        onChange={updateBorderOpacity}
      />
    </div>
  {/if}

  <div
    class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
  >
    <Input type="checkbox" bind:value={$background3D} label="3D Effect" />
  </div>

  {#if $background3D}
    <div
      class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <Slider
        value={$background3DRotation}
        min={-120}
        max={120}
        step={1}
        label="3D Rotation"
        onChange={updateBackground3DRotation}
      />
    </div>
  {/if}
</div>

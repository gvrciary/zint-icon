<script lang="ts">
  import { getProcessedSvg } from '$lib/parser/svg';
  import {
    selectedIcon,
    iconColor,
    noise,
    borderRadius,
    borderStroke,
    borderColor,
    borderOpacity,
    meshGradientColors,
    iconSize,
    iconOffsetX,
    iconOffsetY,
    iconGlass,
    background3D,
    background3DRotation,
    iconGlow,
    contrast,
    saturation,
    brightness,
    customSvg,
    customPng,
    customContentType
  } from '$lib/stores/icon';
  import vertexShader from '$lib/utils/shaders/shaders.vert?raw';
  import fragmentShader from '$lib/utils/shaders/shaders.frag?raw';
  import { initRender } from '$lib/webgl/mesh-render';
  import { onMount } from 'svelte';

  let canvasRef: HTMLCanvasElement;
  let renderContext: { render: () => void; cleanup: () => void } | null = null;
  let processedSvg = $state('');
  let loading = $state(true);

  $effect(() => {
    getProcessedSvg(
      $selectedIcon,
      {
        iconGlow: $iconGlow,
        iconGlass: $iconGlass,
        iconColor: $iconColor,
        iconSize: $iconSize,
        iconOffsetX: $iconOffsetX,
        iconOffsetY: $iconOffsetY
      },
      $customSvg,
      $customPng,
      $customContentType
    ).then((svg) => {
      processedSvg = svg;
    });
  });

  const borderStrokeStyle = $derived(() => {
    const opacity = $borderOpacity / 100;
    const r = parseInt($borderColor.slice(1, 3), 16);
    const g = parseInt($borderColor.slice(3, 5), 16);
    const b = parseInt($borderColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  });

  onMount(() => {
    loading = false;
  });

  $effect(() => {
    if (!canvasRef && renderContext) return;

    renderContext = initRender(canvasRef, vertexShader, fragmentShader, {
      meshGradientColors: $meshGradientColors,
      noise: $noise,
      contrast: $contrast,
      saturation: $saturation,
      brightness: $brightness
    });

    renderContext.render();
  });

  const rectRadius = $derived($borderRadius);
</script>

{#if !loading}
  <div class="flex flex-col items-center space-y-6">
    <div
      class="relative overflow-hidden bg-transparent shadow-2xl"
      style="border-radius: {$borderRadius}px;"
    >
      <div
        class="absolute inset-0 opacity-20"
        style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+'); background-size: 20px 20px;"
      ></div>

      <canvas
        bind:this={canvasRef}
        width="512"
        height="512"
        class="absolute inset-0 z-0"
        style="border-radius: {$borderRadius}px;"
      ></canvas>

      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        class="relative z-10 block"
        style="background: transparent;"
      >
        <defs>
          {#if $background3D}
            <linearGradient
              id="edge3D"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform="rotate({$background3DRotation})"
            >
              <stop offset="0%" style="stop-color:rgba(255,255,255,0.5);stop-opacity:1" />
              <stop offset="30%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
              <stop offset="70%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
            </linearGradient>
            <filter id="edge3DBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blurred" />
            </filter>
          {/if}
        </defs>

        {#if $background3D}
          <rect
            width="512"
            height="512"
            rx={rectRadius}
            ry={rectRadius}
            fill="none"
            stroke="url(#edge3D)"
            stroke-width="20"
            filter="url(#edge3DBlur)"
          />
        {/if}
        {#if $borderStroke > 0}
          <rect
            width="512"
            height="512"
            rx={rectRadius}
            ry={rectRadius}
            fill="none"
            stroke={borderStrokeStyle()}
            stroke-width={$borderStroke}
          />
        {/if}

        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html processedSvg}
      </svg>
    </div>
  </div>
{:else}
  <div
    class="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-gray-900 text-4xl text-gray-900 dark:border-t-gray-300 dark:text-gray-300"
  >
    <div
      class="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-gray-900 text-2xl text-gray-900 dark:border-t-gray-300 dark:text-gray-300"
    ></div>
  </div>
{/if}

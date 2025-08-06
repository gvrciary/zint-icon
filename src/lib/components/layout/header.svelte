<script lang="ts">
  import { Download, ChevronDown } from 'lucide-svelte';
  import Button from '$lib/components/ui/button.svelte';
  import CopyButton from '$lib/components/ui/copy-button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
  import { downloadResolution } from '$lib/stores/icon';
  import { onMount } from 'svelte';
  import { createICOFile, generateImageDataFromSVG } from '$lib/parser/ico';
  import { toast } from 'svelte-sonner';
  import { getCompleteSVG } from '$lib/parser/svg';
  import { cn } from '$lib/utils';

  let isDownloadDropdownOpen = $state(false);
  let dropdownRef: HTMLDivElement;

  onMount(() => {
    function handleClickOutside(event: Event) {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        isDownloadDropdownOpen = false;
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  function toggleDownloadDropdown() {
    isDownloadDropdownOpen = !isDownloadDropdownOpen;
  }

  let svgContent = $state('');

  async function exportSVG() {
    toast.promise(getCompleteSVG(), {
      loading: 'Generating SVG...',
      success: (svgData) => {
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.download = `zin-icon.svg`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
        return 'SVG generated successfully!';
      },
      error: () => `Failed to generate SVG`
    });
  }

  async function exportPNG() {
    try {
      const svgData = await getCompleteSVG();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const resolution = $downloadResolution || 512;
      canvas.width = resolution;
      canvas.height = resolution;

      const png = new Promise<void>((resolve, reject) => {
        img.onload = function () {
          try {
            if (ctx) {
              ctx.drawImage(img, 0, 0, resolution, resolution);
              const link = document.createElement('a');
              link.download = `zin-icon-${resolution}x${resolution}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              URL.revokeObjectURL(url);
              resolve();
            }
          } catch (error) {
            URL.revokeObjectURL(url);
            reject(error);
          }
        };

        img.onerror = function () {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG image'));
        };

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      });

      toast.promise(png, {
        loading: 'Generating PNG...',
        success: () => {
          return 'PNG generated successfully!';
        },
        error: () => `Failed to generate PNG`
      });
    } catch {
      toast.error('Failed to export PNG');
    }
  }

  async function exportICO() {
    try {
      const svgData = await getCompleteSVG();
      const sizes = [16, 32, 48, 64, 128, 256];

      toast.promise(generateImageDataFromSVG(svgData, sizes), {
        loading: 'Generating ICO...',
        success: (images) => {
          const icoData = createICOFile(images, sizes);
          const blob = new Blob([icoData], { type: 'image/x-icon' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.download = `zin-icon.ico`;
          link.href = url;
          link.click();

          URL.revokeObjectURL(url);
          return 'ICO generated successfully!';
        },
        error: () => `Failed to generate ICO`
      });
    } catch {
      toast.error('Failed to export ICO');
    }
  }
</script>

<header class="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
  <div class="px-4 py-3 sm:px-3 sm:py-2 md:px-6 md:py-4">
    <nav class="flex items-center justify-between">
      <a href="/" class="group flex items-center space-x-3 sm:space-x-2">
        <div class="relative h-8 w-8 overflow-hidden sm:h-6 sm:w-6">
          <img src="/icon.svg" alt="Zin Icon Logo" class="h-full w-full object-cover" />
        </div>
        <div class="hidden items-center gap-2 md:flex">
          <span class="text-xl text-black sm:text-lg md:text-xl dark:text-white">ZintIcon</span>
          <span
            class="rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm sm:px-1.5 sm:py-0.5 sm:text-[10px] dark:border-[#333] dark:bg-[#1f1f1f57] dark:text-gray-300"
          >
            beta
          </span>
        </div>
      </a>

      <div class="flex items-center gap-2 sm:gap-1.5">
        <a href="https://github.com/gvrciary/zint-icon" target="_blank" rel="noreferrer">
          <Button variant="glass" size="md" title="Github">
            <svg
              width="1024"
              height="1024"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                transform="scale(64)"
                fill="currentColor"
              /></svg
            >
          </Button>
        </a>
        <ThemeToggle />
        <CopyButton text={svgContent} />

        <div class="relative" bind:this={dropdownRef}>
          <Button variant="glass" size="md" onclick={toggleDownloadDropdown} title="Download">
            <Download class="h-4 w-4 sm:h-3 sm:w-3" />
            <ChevronDown
              class={cn(
                'ml-1 h-3 w-3 transition-transform duration-200 sm:h-2.5 sm:w-2.5',
                isDownloadDropdownOpen && 'rotate-180'
              )}
            />
          </Button>

          {#if isDownloadDropdownOpen}
            <div
              class="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-black/10 bg-black/5 shadow-2xl backdrop-blur-md sm:w-52 dark:border-[#333] dark:bg-[#1f1f1f57]"
            >
              <div
                class="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <button
                  class="cursor-pointer text-left text-sm text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  onclick={async () => {
                    await exportPNG();
                    isDownloadDropdownOpen = false;
                  }}
                >
                  PNG
                </button>
                <Input
                  type="number"
                  bind:value={$downloadResolution}
                  placeholder="512"
                  class="h-7 w-20 text-xs"
                />
              </div>
              <button
                class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                onclick={() => {
                  exportSVG();
                  isDownloadDropdownOpen = false;
                }}
              >
                SVG
              </button>
              <button
                class="w-full cursor-pointer px-4 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                onclick={() => {
                  exportICO();
                  isDownloadDropdownOpen = false;
                }}
              >
                ICO
              </button>
            </div>
          {/if}
        </div>
      </div>
    </nav>
  </div>
</header>

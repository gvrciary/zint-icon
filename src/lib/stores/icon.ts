import { writable, type Writable } from 'svelte/store';
import { getRandomIcon } from '$lib/data/icons';
import { generateRandomMeshColors } from '$lib/utils';

export const selectedIcon: Writable<string> = writable(getRandomIcon());
export const meshGradientColors: Writable<{ color: string; x: number; y: number }[]> = writable(
	generateRandomMeshColors()
);
export const iconColor: Writable<string> = writable('#ffffff');
export const noise: Writable<number> = writable(0);
export const borderRadius: Writable<number> = writable(120);
export const borderStroke: Writable<number> = writable(0);
export const borderColor: Writable<string> = writable('#ffffff');
export const borderOpacity: Writable<number> = writable(100);
export const iconSize: Writable<number> = writable(340);
export const iconOffsetX: Writable<number> = writable(0);
export const iconOffsetY: Writable<number> = writable(0);
export const iconGlass: Writable<boolean> = writable(false);
export const background3D: Writable<boolean> = writable(true);
export const background3DRotation: Writable<number> = writable(0);
export const iconGlow: Writable<boolean> = writable(false);
export const contrast: Writable<number> = writable(100);
export const saturation: Writable<number> = writable(100);
export const brightness: Writable<number> = writable(100);
export const customSvg: Writable<string> = writable('');
export const customPng: Writable<string> = writable('');
export const customContentType: Writable<'svg' | 'png' | null> = writable(null);

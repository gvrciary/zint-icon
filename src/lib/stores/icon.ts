import { writable, type Writable } from 'svelte/store';
import { DEFAULT_ICON } from '$lib/data/icons';
import type { GradientStop } from '$lib/types';

export const selectedIcon: Writable<string> = writable(DEFAULT_ICON);
export const backgroundType: Writable<'solid' | 'linear' | 'radial' | 'mesh'> = writable('solid');
export const backgroundColor: Writable<string> = writable('#8564fa');
export const gradientStops: Writable<GradientStop[]> = writable([
	{ color: '#8564fa', position: 0 },
	{ color: '#FF6B6B', position: 100 }
]);
export const gradientAngle: Writable<number> = writable(45);
export const iconColor: Writable<string> = writable('#ffffff');
export const noise: Writable<number> = writable(0);
export const borderRadius: Writable<number> = writable(120);
export const borderStroke: Writable<number> = writable(0);
export const borderColor: Writable<string> = writable('#ffffff');
export const borderOpacity: Writable<number> = writable(100);
export const meshGradientColors: Writable<{ color: string; x: number; y: number }[]> = writable([
	{ color: '#7B9B05', x: -20, y: -10 },
	{ color: '#0094FF', x: 120, y: 40 },
	{ color: '#CD4E57', x: 60, y: 110 },
	{ color: '#0032FF', x: -10, y: 80 },
	{ color: '#C84BE0', x: 90, y: -15 }
]);
export const iconSize: Writable<number> = writable(192);
export const iconOffsetX: Writable<number> = writable(0);
export const iconOffsetY: Writable<number> = writable(0);

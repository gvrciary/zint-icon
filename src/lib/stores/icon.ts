import { writable, type Writable } from 'svelte/store';
import { DEFAULT_ICON } from '$lib/data/icons';

export const selectedIcon: Writable<string> = writable(DEFAULT_ICON);
export const backgroundType: Writable<'solid' | 'mesh'> = writable('mesh');
export const meshGradientColors: Writable<{ color: string; x: number; y: number }[]> = writable([
	{ color: '#000000', x: -20, y: -10 },
	{ color: '#0094FF', x: 120, y: 40 },
	{ color: '#CD4E57', x: 60, y: 110 },
	{ color: '#0032FF', x: -10, y: 80 },
	{ color: '#C84BE0', x: 90, y: -15 }
]);
export const backgroundColor: Writable<string> = writable('#8564fa');
export const iconColor: Writable<string> = writable('#ffffff');
export const noise: Writable<number> = writable(0);
export const borderRadius: Writable<number> = writable(120);
export const borderStroke: Writable<number> = writable(0);
export const borderColor: Writable<string> = writable('#ffffff');
export const borderOpacity: Writable<number> = writable(100);
export const iconSize: Writable<number> = writable(250);
export const iconOffsetX: Writable<number> = writable(0);
export const iconOffsetY: Writable<number> = writable(0);
export const liquidGlass: Writable<boolean> = writable(false);
export const background3D: Writable<boolean> = writable(true);
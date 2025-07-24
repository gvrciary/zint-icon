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
	{ color: '#8564fa', x: -20, y: -10 },
	{ color: '#FF6B6B', x: 120, y: 40 },
	{ color: '#4ECDC4', x: 60, y: 110 },
	{ color: '#FFD93D', x: -10, y: 80 },
	{ color: '#6BCF7F', x: 90, y: -15 }
]);

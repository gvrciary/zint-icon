import { writable, type Writable } from 'svelte/store';
import { DEFAULT_ICON } from '$lib/data/icons';
import type { GradientStop } from '$lib/types';

export const selectedIcon: Writable<string> = writable(DEFAULT_ICON);
export const backgroundType: Writable<'solid' | 'linear' | 'radial'> = writable('solid');
export const backgroundColor: Writable<string> = writable('#8564fa');
export const gradientStops: Writable<GradientStop[]> = writable([
	{ color: '#8564fa', position: 0 },
	{ color: '#FF6B6B', position: 100 }
]);
export const gradientAngle : Writable<number> = writable(45);
export const iconColor : Writable<string> = writable('#ffffff');

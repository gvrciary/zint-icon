import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { colorPalette } from '$lib/constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomPosition() {
	return {
		x: Math.random() * 120 - 10,
		y: Math.random() * 120 - 10
	};
}

export function generateRandomMeshColors(): { color: string; x: number; y: number }[] {
	const meshColors: { color: string; x: number; y: number }[] = [];

	for (let i = 0; i < 3; i++) {
		const randomIndex = Math.floor(Math.random() * colorPalette.length);
		meshColors.push({
			color: colorPalette[randomIndex],
			...generateRandomPosition()
		});
	}

	return meshColors;
}

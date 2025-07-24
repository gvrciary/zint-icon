export function generateLiquidGlassEffect() {
	const defs = `
		<linearGradient id="glassMainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#575757" />
			<stop offset="100%" stop-color="#151515" />
		</linearGradient>

		<linearGradient id="glassBlurGradient" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#E3E3E5" stop-opacity="0.6" />
			<stop offset="100%" stop-color="#BBBBC0" stop-opacity="0.6" />
		</linearGradient>

		<linearGradient id="glassShineGradient" x1="0%" y1="0%" x2="0%" y2="50%">
			<stop offset="0%" stop-color="#fff" />
			<stop offset="100%" stop-color="#fff" stop-opacity="0" />
		</linearGradient>

		<filter id="glassBlurFilter" x="-100%" y="-100%" width="400%" height="400%">
			<feGaussianBlur stdDeviation="2" result="blur" />
		</filter>

		<clipPath id="glassClipPath">
			<path id="clipPathShape" />
		</clipPath>

		<mask id="glassMask">
			<rect width="100%" height="100%" fill="#FFF" />
			<path id="maskPathShape" fill="#000" />
		</mask>
	`;

	return { defs };
}

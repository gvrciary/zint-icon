import { createShaderProgram } from './shader';
import { hexToRgb } from '$lib/utils/webgl';

export function initRender(
	canvas: HTMLCanvasElement,
	vertexSrc: string,
	fragmentSrc: string,
	options: {
		meshGradientColors: { color: string; x: number; y: number }[];
		noise: number;
	}
): () => void {
	const gl = canvas.getContext('webgl');
	if (!gl) {
		console.error('WebGL not supported');
		return () => {};
	}

	const program = createShaderProgram(gl, vertexSrc, fragmentSrc);
	const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);

	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const aPosition = gl.getAttribLocation(program, 'aPosition');
	gl.enableVertexAttribArray(aPosition);
	gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

	gl.useProgram(program);

	function render() {
		if (!gl) return;

		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);

		const bgColor: [number, number, number] = options.meshGradientColors[0]
			? hexToRgb(options.meshGradientColors[0].color)
			: [0, 0, 0];
		gl.uniform3f(gl.getUniformLocation(program, 'u_bgColor'), ...bgColor);

		const colors: number[] = [];
		const positions: number[] = [];
		const numPoints = Math.min(options.meshGradientColors.length, 10);

		for (let i = 0; i < 10; i++) {
			if (i < numPoints) {
				const { color, x, y } = options.meshGradientColors[i];
				const rgb = hexToRgb(color);
				colors.push(rgb[0], rgb[1], rgb[2]);
				positions.push(x / 100, y / 100);
			} else {
				colors.push(0, 0, 0);
				positions.push(0, 0);
			}
		}

		gl.uniform3fv(gl.getUniformLocation(program, 'u_colors'), colors);
		gl.uniform2fv(gl.getUniformLocation(program, 'u_positions'), positions);
		gl.uniform1i(gl.getUniformLocation(program, 'u_numberPoints'), numPoints);
		gl.uniform1f(gl.getUniformLocation(program, 'u_noiseRatio'), (options.noise / 100) * 0.1);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	return render;
}

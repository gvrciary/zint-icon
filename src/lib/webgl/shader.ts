export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
	}
	
	return shader;
}

export function createShaderProgram(
	gl: WebGLRenderingContext,
	vertexSrc: string,
	fragmentSrc: string
): WebGLProgram {
	const vs = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
	const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
	const program = gl.createProgram()!;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error('Shader link error: ' + gl.getProgramInfoLog(program));
	}
	
	return program;
}

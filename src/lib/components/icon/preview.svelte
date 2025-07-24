<script lang="ts">
	import { cn } from '$lib/utils';
	import { getIconPath } from '$lib/data/icons';
	import {
		selectedIcon,
		backgroundType,
		backgroundColor,
		gradientStops,
		gradientAngle,
		iconColor,
		noise,
		borderRadius,
		borderStroke,
		borderColor,
		borderOpacity,
		meshGradientColors
	} from '$lib/stores/icon';
	import { onMount } from 'svelte';

	let svgRef: SVGSVGElement;
	let canvasRef: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let shaderProgram: WebGLProgram | null = null;

	const gradientId = 'icon-gradient';
	const noiseId = 'noise-filter';

	const vertexShaderSource = `
		#ifdef GL_ES
		precision mediump float;
		#endif

		attribute vec3 aPosition;

		void main() {
			vec4 positionVec4 = vec4(aPosition, 1.0);
			positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
			gl_Position = positionVec4;
		}
	`;

	const fragmentShaderSource = `
		#ifdef GL_ES
		precision highp float;
		#endif

		uniform vec2 u_resolution;
		uniform vec3 u_bgColor;
		uniform vec3 u_colors[10];
		uniform vec2 u_positions[10];
		uniform int u_numberPoints;
		uniform float u_noiseRatio;

		float rand(vec2 n) {
			return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
		}

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution.xy;
			st.y=1.-st.y;
			vec3 noise=vec3(rand(vec2(st.x*5.,st.y*5.)));

			float pointGradient=0.;
			vec3 colorGradient=vec3(0.);
			float totalLight=1.;

			for(int i=0;i<10;i++){
				if(i<u_numberPoints){
					vec3 color=u_colors[i];
					vec2 pointPos=u_positions[i];
					float dist=1.-distance(st,pointPos)*1.1;
					pointGradient+=clamp(dist,0.,1.);
					colorGradient+=color*clamp(dist,0.,1.);
					totalLight*=(1.-dist)*(1.-dist);
				}
			}

			totalLight=smoothstep(0.,1.,clamp(1.-totalLight,0.,1.));
			colorGradient=(colorGradient/pointGradient)*totalLight;
			vec3 bgGradient=(1.-totalLight)*u_bgColor;
			vec3 total=mix(clamp(colorGradient,0.,1.)+bgGradient,noise,u_noiseRatio);
			gl_FragColor = vec4(vec3(total),1.);
		}
	`;

	function createShader(
		gl: WebGLRenderingContext,
		type: number,
		source: string
	): WebGLShader | null {
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	function createShaderProgram(gl: WebGLRenderingContext): WebGLProgram | null {
		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

		if (!vertexShader || !fragmentShader) return null;

		const program = gl.createProgram();
		if (!program) return null;

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Error linking program:', gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}

		return program;
	}

	function hexToRgb(hex: string): [number, number, number] {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;
		return [r, g, b];
	}

	function initWebGL() {
		if (!canvasRef) return;

		gl = canvasRef.getContext('webgl');
		if (!gl) {
			console.error('WebGL not supported');
			return;
		}

		shaderProgram = createShaderProgram(gl);
		if (!shaderProgram) return;

		const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
		gl.enableVertexAttribArray(aPosition);
		gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

		gl.useProgram(shaderProgram);
		render();
	}

	function render() {
		if (!gl || !shaderProgram) return;

		gl.viewport(0, 0, 512, 512);
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.uniform2f(gl.getUniformLocation(shaderProgram, 'u_resolution'), 512, 512);

		const bgColor = $meshGradientColors[0] ? hexToRgb($meshGradientColors[0].color) : [0, 0, 0];
		gl.uniform3f(
			gl.getUniformLocation(shaderProgram, 'u_bgColor'),
			bgColor[0],
			bgColor[1],
			bgColor[2]
		);

		const colors: number[] = [];
		const positions: number[] = [];
		const numPoints = Math.min($meshGradientColors.length, 10);

		for (let i = 0; i < 10; i++) {
			if (i < numPoints) {
				const meshColor = $meshGradientColors[i];
				const rgb = hexToRgb(meshColor.color);
				colors.push(rgb[0], rgb[1], rgb[2]);
				positions.push(meshColor.x / 100, meshColor.y / 100);
			} else {
				colors.push(0, 0, 0);
				positions.push(0, 0);
			}
		}

		gl.uniform3fv(gl.getUniformLocation(shaderProgram, 'u_colors'), colors);
		gl.uniform2fv(gl.getUniformLocation(shaderProgram, 'u_positions'), positions);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, 'u_numberPoints'), numPoints);
		gl.uniform1f(gl.getUniformLocation(shaderProgram, 'u_noiseRatio'), ($noise / 100) * 0.1);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	const backgroundFill = $derived(() => {
		if ($backgroundType === 'solid') return $backgroundColor;
		if ($backgroundType === 'mesh') return 'transparent';
		return `url(#${gradientId})`;
	});

	const sortedGradientStops = $derived([...$gradientStops].sort((a, b) => a.position - b.position));

	const gradientCoords = $derived(() => {
		if ($backgroundType !== 'linear') return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };

		const angleRad = ($gradientAngle * Math.PI) / 180;

		const x1 = 50 + 50 * Math.cos(angleRad + Math.PI / 2);
		const y1 = 50 + 50 * Math.sin(angleRad + Math.PI / 2);
		const x2 = 50 + 50 * Math.cos(angleRad - Math.PI / 2);
		const y2 = 50 + 50 * Math.sin(angleRad - Math.PI / 2);

		return {
			x1: `${x1}%`,
			y1: `${y1}%`,
			x2: `${x2}%`,
			y2: `${y2}%`
		};
	});

	const iconPath = $derived(getIconPath($selectedIcon));

	const borderStrokeStyle = $derived(() => {
		if ($borderStroke === 0) return {};
		const opacity = $borderOpacity / 100;
		const r = parseInt($borderColor.slice(1, 3), 16);
		const g = parseInt($borderColor.slice(3, 5), 16);
		const b = parseInt($borderColor.slice(5, 7), 16);
		const strokeColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
		return {
			stroke: strokeColor,
			'stroke-width': $borderStroke,
			fill: backgroundFill
		};
	});

	const rectRadius = $derived($borderRadius);

	onMount(() => {
		if ($backgroundType === 'mesh') {
			initWebGL();
		}
	});

	$effect(() => {
		if ($backgroundType === 'mesh' && canvasRef) {
			initWebGL();
		}
	});

	$effect(() => {
		if ($backgroundType === 'mesh' && gl && shaderProgram) {
			render();
		}
	});
</script>

<div class={cn('flex flex-col items-center space-y-6')}>
	<div
		class="relative overflow-hidden bg-transparent shadow-2xl"
		style="border-radius: {$borderRadius}px;"
	>
		<div
			class="absolute inset-0 opacity-20"
			style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+'); background-size: 20px 20px;"
		></div>

		{#if $backgroundType === 'mesh'}
			<canvas
				bind:this={canvasRef}
				width="512"
				height="512"
				class="absolute inset-0 z-0"
				style="border-radius: {$borderRadius}px;"
			></canvas>
		{/if}

		<svg
			bind:this={svgRef}
			width="512"
			height="512"
			viewBox="0 0 512 512"
			xmlns="http://www.w3.org/2000/svg"
			class="relative z-10 block"
			style="background: transparent;"
		>
			<defs>
				{#if $backgroundType === 'linear'}
					<linearGradient
						id={gradientId}
						x1={gradientCoords().x1}
						y1={gradientCoords().y1}
						x2={gradientCoords().x2}
						y2={gradientCoords().y2}
					>
						{#each sortedGradientStops as stop, index (`${index}-${stop.position}-${stop.color}`)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</linearGradient>
				{:else if $backgroundType === 'radial'}
					<radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
						{#each sortedGradientStops as stop, index (`${index}-${stop.position}-${stop.color}`)}
							<stop offset="{stop.position}%" stop-color={stop.color} />
						{/each}
					</radialGradient>
				{/if}

				{#if $noise > 0}
					<filter id={noiseId}>
						<feTurbulence
							baseFrequency="0.9"
							numOctaves="1"
							seed="2"
							result="noise"
							type="fractalNoise"
						/>
						<feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
						<feComponentTransfer in="monoNoise" result="contrastNoise">
							<feFuncA type="discrete" tableValues="0.5 0.5" />
						</feComponentTransfer>
						<feBlend
							in="SourceGraphic"
							in2="contrastNoise"
							mode="overlay"
							opacity={($noise / 100) * 0.3}
						/>
					</filter>
				{/if}
			</defs>

			{#if $backgroundType !== 'mesh'}
				<rect
					width="512"
					height="512"
					rx={rectRadius}
					ry={rectRadius}
					fill={backgroundFill()}
					stroke={$borderStroke > 0 ? borderStrokeStyle().stroke : 'none'}
					stroke-width={$borderStroke}
					filter={$noise > 0 ? `url(#${noiseId})` : undefined}
				/>
			{:else if $borderStroke > 0}
				<rect
					width="512"
					height="512"
					rx={rectRadius}
					ry={rectRadius}
					fill="none"
					stroke={borderStrokeStyle().stroke}
					stroke-width={$borderStroke}
				/>
			{/if}

			<g transform="translate(256, 256)">
				<g transform="scale(8) translate(-12, -12)">
					<path
						d={iconPath}
						fill="none"
						stroke={$iconColor}
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</g>
		</svg>
	</div>

	<div class="space-y-1 text-center">
		<p class="text-sm font-medium text-zinc-300">{$selectedIcon}</p>
		<p class="text-xs text-zinc-500">512 × 512 pixels</p>
	</div>
</div>

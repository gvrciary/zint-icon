#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec3 u_bgColor;
uniform vec3 u_colors[10];
uniform vec2 u_positions[10];
uniform int u_numberPoints;
uniform float u_noiseRatio;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_brightness;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.y = 1. - st.y;
    vec3 noise = vec3(rand(vec2(st.x * 5., st.y * 5.)));

    float pointGradient = 0.;
    vec3 colorGradient = vec3(0.);
    float totalLight = 1.;

    for (int i = 0; i < 10; i++) {
        if (i < u_numberPoints) {
            vec3 color = u_colors[i];
            vec2 pointPos = u_positions[i];
            float dist = 1. - distance(st, pointPos) * 1.1;
            pointGradient += clamp(dist, 0., 1.);
            colorGradient += color * clamp(dist, 0., 1.);
            totalLight *= (1. - dist) * (1. - dist);
        }
    }

    totalLight = smoothstep(0., 1., clamp(1. - totalLight, 0., 1.));
    colorGradient = (colorGradient / pointGradient) * totalLight;
    vec3 bgGradient = (1. - totalLight) * u_bgColor;
    vec3 total = mix(clamp(colorGradient, 0., 1.) + bgGradient, noise, u_noiseRatio);

    total *= u_brightness;

    total = (total - 0.5) * u_contrast + 0.5;

    float gray = dot(total, vec3(0.299, 0.587, 0.114));
    total = mix(vec3(gray), total, u_saturation);

    gl_FragColor = vec4(clamp(total, 0., 1.), 1.);
}

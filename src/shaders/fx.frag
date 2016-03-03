#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 startColor;
uniform vec3 endColor;
uniform float lineWidth;
uniform float margin;
uniform float invert;
uniform float iGlobalTime;

varying vec4 vPosition;

#pragma glslify: noise = require('glsl-noise/simplex/4d')
#pragma glslify: aastep = require('glsl-aastep')

void main() {

	float diff = vPosition.y - sin(vPosition.x * .5) + iGlobalTime;
	float dist = lineWidth + margin;
	float alpha = abs(mod(diff, dist) - mod(mod(diff, dist), lineWidth));
	
	if (alpha > 0.0) {
		alpha = 0.0;
	} else {
		alpha = 0.6;
	}

	// alpha = alpha * (vPosition.z + (3.0 * (1.0 - (vPosition.y+4.0) / 28.0)) ) / 8.0;

	vec3 color = vec3(mix(endColor, startColor, vPosition.z + 2.0));
	// vec3 color = startColor;
	
	gl_FragColor = vec4(color, alpha);

}
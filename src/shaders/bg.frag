#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 color;
uniform float lineWidth;
uniform float margin;
uniform float iGlobalTime;

varying vec4 vPosition;

void main() {

	float diff = vPosition.y - vPosition.x * .5 + iGlobalTime;
	float dist = lineWidth + margin;
	float alpha = abs(mod(diff, dist) - mod(mod(diff, dist), lineWidth));
	
	if (alpha > 0.0) {
		alpha = 0.0;
	} else {
		alpha = 0.04;
	}

	gl_FragColor = vec4(color, alpha);

}
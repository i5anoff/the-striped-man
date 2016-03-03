let glslify = require('glslify');

class Background extends THREE.Object3D {

	constructor () {

		super();

		// params
		this.startColor = '#000000';
		this.lineWidth = 400;
		this.margin = 400;

		// material
		this.material = new THREE.RawShaderMaterial({
			vertexShader: glslify('../../shaders/fx.vert'),
			fragmentShader: glslify('../../shaders/bg.frag'),
			uniforms: {
				lineWidth: { type: 'f', value: this.lineWidth },
				margin: { type: 'f', value: this.margin },
				color: { type: 'c', value: new THREE.Color(this.startColor) },
				iGlobalTime: { type: 'f', value: 0.0 }
			},
			transparent: true,
			depthTest: false,
			side: THREE.DoubleSide
		});

		// geometry
		this.geometry = new THREE.BoxGeometry(2000,2000,2000);

		// mesh
		this.mesh = new THREE.Mesh( this.geometry, this.material );

		this.add( this.mesh );

	}

	update() {

		this.material.uniforms.iGlobalTime.value += 0.005;

		if (window.app && !window.app.soundManager.pause && window.app.soundEffect) {
			this.material.uniforms.lineWidth.value = this.lineWidth * (window.app.soundManager.drum + 1);
		} else {
			this.material.uniforms.lineWidth.value = this.lineWidth;
		}

	}
	
}

export default Background;
let glslify = require('glslify');

class Model extends THREE.Object3D {

	constructor () {

		super();

		// params
		this.startColor = '#F2A700';
		this.endColor = '#AE3060';
		this.lineWidth = 4;
		this.margin = 50;
		this.scaleRatio = 60;
		

		// material
		this.material = new THREE.RawShaderMaterial({
			vertexShader: glslify('../../shaders/fx.vert'),
			fragmentShader: glslify('../../shaders/fx.frag'),
			uniforms: {
				lineWidth: { type: 'f', value: this.lineWidth / this.scaleRatio },
				margin: { type: 'f', value: this.margin / this.scaleRatio },
				invert: { type: 'f', value: 1.0 },
				startColor: { type: 'c', value: new THREE.Color(this.startColor) },
				endColor: { type: 'c', value: new THREE.Color(this.endColor) },
				animate: { type: 'f', value: 0.0 },
				iGlobalTime: { type: 'f', value: 0.0 }
			},
			transparent: true,
			depthTest: false,
			side: THREE.DoubleSide
		});

		this.loader = new THREE.JSONLoader();
		this.loader.load( '../../assets/LeePerrySmith.js', ( geometry ) => {

			// mesh
			this.mesh = new THREE.Mesh( geometry, this.material );
			this.mesh.scale.x = this.scaleRatio;
			this.mesh.scale.y = this.scaleRatio;
			this.mesh.scale.z = this.scaleRatio;

			this.add( this.mesh );
	
		} );

		// gui
		this.initGui();

	}

	initGui () {

		let startColor = window.gui.addColor(this, 'startColor');
		startColor.onChange(() => {
			this.material.uniforms.startColor.value = new THREE.Color(this.startColor);
		});

		let endColor = window.gui.addColor(this, 'endColor');
		endColor.onChange(() => {
			this.material.uniforms.endColor.value = new THREE.Color(this.endColor);
		});

		let lineWidth = window.gui.add(this, 'lineWidth', 0.0, 100.0);
		lineWidth.onChange(() => {
			this.material.uniforms.lineWidth.value = this.lineWidth / this.scaleRatio;
		});

		let margin = window.gui.add(this, 'margin', 0.0, 100.0);
		margin.onChange(() => {
			this.material.uniforms.margin.value = this.margin / this.scaleRatio;
		});

	}

	update() {

		this.material.uniforms.iGlobalTime.value += 0.005;

		if (window.app && !window.app.soundManager.pause && window.app.soundEffect) {
			this.material.uniforms.margin.value = this.margin / this.scaleRatio * (window.app.soundManager.voice * 0.4 + 1);
		} else {
			this.material.uniforms.margin.value = this.margin / this.scaleRatio;
		}

	}
	
}

export default Model;
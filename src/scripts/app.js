import SoundManager from './managers/soundManager';
import Background from './modules/background';
import Model from './modules/model';

WAGNER.vertexShadersPath = '/Wagner/vertex-shaders';
WAGNER.fragmentShadersPath = '/Wagner/fragment-shaders';

class App {
	
	constructor() {

		// binded
		this.resize = this.resize.bind(this);
		this.animate = this.animate.bind(this);

		// params
		this.backgroundColor = 0x43009B;
		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;
		this.useNoise = false;
		this.useVignette = false;
		this.useBloom = false;
		this.soundEffect = true;
		this.gui = window.gui = new dat.GUI();

		// wagner passes
		this.noisePass = new WAGNER.NoisePass();
		this.bloomPass = new WAGNER.MultiPassBloomPass();
		this.vignettePass = new WAGNER.VignettePass();

		// noise pass
		this.noisePass.params.amount = 0.05;
		this.noisePass.params.speed = 0.05;

		// vignette pass
		this.vignettePass.params.amount = 1;

		// bloom pass
		this.bloomPass.params.strength = .5;
        this.bloomPass.params.blurAmount = .1;
        this.bloomPass.params.applyZoomBlur = !0;
        this.bloomPass.params.zoomBlurStrength = .3;
		
		// init gui
		this.wagnerGui = this.gui.addFolder('Wagner');
		this.wagnerGui.add(this, 'useNoise');
		this.wagnerGui.add(this, 'useVignette');
		this.wagnerGui.add(this, 'useBloom');
		let backgroundColor = window.gui.addColor(this, 'backgroundColor');
		backgroundColor.onChange(() => {
			this.renderer.setClearColor(this.backgroundColor, 1);
		});

		this.init();
		
		window.addEventListener('resize', this.resize, true);

	}

	init() {

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
		this.renderer.setClearColor(this.backgroundColor, 1);
		this.renderer.autoClearColor = true;
		
		this.camera = new THREE.PerspectiveCamera(45, this.wWidth/this.wHeight, 1, 4000);
		this.camera.position.x = -200;
		this.camera.position.y = 100;
		this.camera.position.z = 1000;

		this.renderer.setSize(this.wWidth, this.wHeight);

		this.container = document.getElementById('container');

		this.canvas = this.renderer.domElement;

		this.container.appendChild( this.canvas );

		this.composer = new WAGNER.Composer( this.renderer );
		this.composer.setSize( this.wWidth, this.wHeight );

		this.addLights();

		this.addControls();
		
		this.background = new Background();
		this.model = new Model();

		this.scene.add( this.background );
		this.scene.add( this.model );

		this.gui.add(this, 'soundEffect');

		this.soundManager = new SoundManager();

		this.update();
		
	}

	addLights() {

		let light = new THREE.DirectionalLight(0xffffff, 0.5);
		light.position.set(300,300,300);
		this.scene.add(light);
		
		let pointlight = new THREE.PointLight(0xffffff, 2, 2000);
		this.scene.add(pointlight);

    }

	addControls() {

		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		this.controls.noRotate = false;
		this.controls.dynamicDampingFactor = .15;
		this.controls.minDistance = 0;
		this.controls.maxDistance = 1000;
		// this.controls.addEventListener('change', this.animate);

	}

	update() {

		this.controls.update();
		
		this.animate()

		requestAnimationFrame(this.update.bind(this))
		
	}

	animate() {

		this.composer.reset();
		this.composer.render( this.scene, this.camera );
		if (this.useNoise) this.composer.pass( this.noisePass );
		if (this.useVignette) this.composer.pass( this.vignettePass );
		if (this.useBloom) this.composer.pass( this.bloomPass );
		
		this.composer.toScreen();

		this.background.update();
		this.model.update();
		this.soundManager.update();

	}

	resize () {

		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;

		this.camera.aspect = this.wWidth / this.wHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( this.wWidth, this.wHeight );

	}

}

window.app = new App();
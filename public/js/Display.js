function rotateAroundWorldAxis( object, axis, radians ) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiplySelf( object.matrix );
    object.matrix = rotationMatrix;
    object.rotation.setEulerFromRotationMatrix( object.matrix );
}

var Display = function(client){
	this.client = client;

	this.planeModel = null;
	this.skybox = null;

	this.three = {};

	this.container = $("#webgl");

	this.cam;

	this.init();
}


Display.prototype.init = function(){
	var WIDTH = this.container.width();
	var HEIGHT = this.container.height();

	var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 1000000;

	this.three.renderer = new THREE.WebGLRenderer({antialias:true});
	this.three.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	this.three.scene = new THREE.Scene();
	this.three.scene.add(this.three.camera);

	//LUMIERE

	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
	hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
	hemiLight.position.set( 0, 500, 0 );


	var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.position.set( -1, 0.75, 1 );
	dirLight.position.multiplyScalar( 50);
	dirLight.name = "dirlight";

	this.three.scene.add(dirLight);

	this.three.renderer.setSize(WIDTH, HEIGHT);

	this.initSkybox();
	this.initGround();

	var _this = this;
	var loader = new THREE.OBJLoader();
	loader.load('model/plane.obj', function ( object ) {
		_this.planeModel = object;
		_this.cam = object.clone();
		_this.three.scene.add(_this.cam);
	});

	this.container.append(this.three.renderer.domElement);
}

Display.prototype.windowResize = function(){
	var WIDTH = this.container.width();
	var HEIGHT = this.container.height();
	this.three.camera.aspect = WIDTH/HEIGHT;
	this.three.renderer.setSize(WIDTH, HEIGHT);
}

Display.prototype.render = function(){
	

	if(this.client && this.client.room){
		for(var i in this.client.room.players){
			var p = this.client.room.players[i];
			p.mesh.position.set(p.position.x, p.position.y, p.position.z);
			p.mesh.rotation.set(0, p.rotation.v, p.rotation.h, 'XYZ' );
			p.rotation.v += 0.02;
			p.rotation.h += 0.02;

			if(p.id == this.client.pid && this.three.camera){

				// this.cam.position.set(p.position.x + Math.cos(p.rotation.v + Math.PI) * 5000, p.position.y, p.position.z - Math.sin(p.rotation.v + Math.PI) * 5000);
				// this.cam.rotation.set(0, p.rotation.v, p.rotation.h, 'XYZ' );

				this.three.camera.position.set(p.position.x + Math.cos(p.rotation.v + Math.PI) * 5000, p.position.y, p.position.z - Math.sin(p.rotation.v + Math.PI) * 5000);
				this.three.camera.rotation.set(0, p.rotation.v - Math.PI/2, p.rotation.h, 'XYZ' );
				// this.three.camera.position.set(p.position.x - 10000, p.position.y, p.position.z);
				// this.three.camera.rotation.set(0, - Math.PI/2, 0, 'XYZ');
			}
		}
	}
	

	this.updateSkybox();
	this.three.renderer.render(this.three.scene, this.three.camera);
}

Display.prototype.addPlayer = function(player){
	player.mesh = this.planeModel.clone();
	this.three.scene.add(player.mesh);
}

Display.prototype.removePlayer = function(player){
	this.three.scene.remove(player.mesh);
}

Display.prototype.initSkybox = function(){
	var cubeMap = new THREE.CubeTexture( [] );
	cubeMap.format = THREE.RGBFormat;
	var loader = new THREE.ImageLoader();
	loader.load('img/skybox.png', function ( image ) {
		var getSide = function ( x, y ) {
			var size = 512;
			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext( '2d' );
			context.drawImage(image, - x * size, - y * size);
			return canvas;
		};
		cubeMap.images[ 0 ] = getSide( 2, 1 );
		cubeMap.images[ 1 ] = getSide( 0, 1 );
		cubeMap.images[ 2 ] = getSide( 1, 0 );
		cubeMap.images[ 3 ] = getSide( 1, 2 ); 
		cubeMap.images[ 4 ] = getSide( 1, 1 );
		cubeMap.images[ 5 ] = getSide( 3, 1 );
		cubeMap.needsUpdate = true;
	});

	var cubeShader = THREE.ShaderLib[ 'cube' ];
	cubeShader.uniforms[ 'tCube' ].value = cubeMap;

	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

	var skyBox = new THREE.Mesh(
		new THREE.BoxGeometry(1000000, 1000000, 1000000),
		skyBoxMaterial
		);

	this.skybox = skyBox;

	this.three.scene.add(this.skybox);
}

Display.prototype.updateSkybox = function(){
	this.skybox.position.x = this.three.camera.position.x;
	this.skybox.position.y = this.three.camera.position.y;
	this.skybox.position.z = this.three.camera.position.z;
}

Display.prototype.initGround = function(){
	//var ground = this.client.room.map.ground;

	var geometry = new THREE.PlaneGeometry(500000, 500000, 100, 100);

	for (var i = 0, l = geometry.vertices.length; i < l; i++) {
		geometry.vertices[i].z = -Math.random() * 10000;
	}

	var material = new THREE.MeshLambertMaterial({
		color: 0xdddddd, 
		wireframe: true
	});

	var plane = new THREE.Mesh(geometry, material);
	plane.position.z += 800;
	plane.rotation.x = Math.PI/2;

	this.three.scene.add(plane);
}
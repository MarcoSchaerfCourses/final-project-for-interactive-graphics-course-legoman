var sLight = false;
var yes = false;
var no = false;
var wave = false;
var walk = false;
var run = false;
var walkX = false;

//size for figure parts
var sizes	= {};
	sizes.charH	= 1;
	sizes.pixRatio	= 1/32;

	sizes.headH	=  8 * sizes.pixRatio;
	sizes.headW	=  8 * sizes.pixRatio;
	sizes.headD	=  8 * sizes.pixRatio;

	sizes.bodyH	= 12 * sizes.pixRatio;
	sizes.bodyW	=  8 * sizes.pixRatio;
	sizes.bodyD	=  4 * sizes.pixRatio;

	sizes.legH	= 12 * sizes.pixRatio;
	sizes.legW	=  4 * sizes.pixRatio;
	sizes.legD	=  4 * sizes.pixRatio;

	sizes.armH	= 12 * sizes.pixRatio;
	sizes.armW	=  4 * sizes.pixRatio;
	sizes.armD	=  4 * sizes.pixRatio;

var onRenderFcts = [];
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x7ec0ee ); // changing the default(black) to sky color.

var camera	= new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 10000 );
			
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0);

document.body.appendChild( renderer.domElement);

//TEXTURES
//for the body
var bodyTexture = new THREE.TextureLoader().load("checkerboard.jpg");

//for the grass
var grassTexture = new THREE.TextureLoader().load("grass.png");
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.offset.set(0,0);
grassTexture.repeat.set(2,2);
var grassMaterial = new THREE.MeshPhongMaterial({map: grassTexture});

//for the head 
var loader = new THREE.TextureLoader();
var materialArray = [
    new THREE.MeshBasicMaterial( { map: loader.load("face1.png") } ),
    new THREE.MeshBasicMaterial( { map: loader.load("face1.png") } ),
    new THREE.MeshBasicMaterial( { map: loader.load("face1.png") } ),
    new THREE.MeshBasicMaterial( { map: loader.load("face1.png") } ),
    new THREE.MeshBasicMaterial( { map: loader.load("face.png") } ),
    new THREE.MeshBasicMaterial( { map: loader.load("face1.png") } ),
];

//creating body
var geometry = new THREE.BoxGeometry(sizes.bodyW, sizes.bodyH, sizes.bodyD);
var material = new THREE.MeshBasicMaterial({map: bodyTexture});
material.needsUpdate = true;

var body = new THREE.Mesh( geometry, material );
body.position.set(0,0,-2);

//creating head
var geometry = new THREE.BoxGeometry(sizes.headW,sizes.headH,sizes.headD);
var head = new THREE.Mesh(geometry, materialArray);
head.position.set(0.0,sizes.bodyH/1.2,0);
//var x = new THREE.Vector3( 1, 0, 0 );
//head.rotateOnAxis(x,-0.2);

//creating leftArm
var geometry = new THREE.BoxGeometry(sizes.armW,sizes.armH,sizes.armD);

var leftArm = new THREE.Mesh(geometry, material);
leftArm.position.set(sizes.bodyW/2 + sizes.armW/2,sizes.bodyH/100,0);

//creating rightArm
var geometry = new THREE.BoxGeometry(sizes.armW,sizes.armH,sizes.armD);
var rightArm = new THREE.Mesh(geometry,material);
rightArm.position.set(-sizes.bodyW/2 - sizes.armW/2,sizes.bodyH/100,0);

//creating leftLeg
var geometry = new THREE.BoxGeometry(sizes.legW,sizes.legH,sizes.legD);
var leftLeg = new THREE.Mesh(geometry,material);
leftLeg.position.set(sizes.bodyW/3.6,-sizes.bodyH,0);

//creating rightLeg
var geometry = new THREE.BoxGeometry(sizes.legW,sizes.legH,sizes.legD);
var rightLeg = new THREE.Mesh(geometry,material);
rightLeg.position.set(-0.06,-sizes.bodyH,0);

//create a group
//body will be the root, all the other parts will be its children.

//ambient Light
var light = new THREE.AmbientLight(0x00ffff,1);
light.position.set(0,1,0);

//spotLight(optional with the button click)
var spotLight = new THREE.SpotLight(0xffffff,0.5);
spotLight.position.set( 0,1,0 );

spotLight.visible = false;
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

window.onload = function()
{
 document.getElementById("dirLightButton").onclick = function()
 {
	 if(!sLight)
	 {
		 spotLight.visible = true;
		 scene.add(spotLight);
	 }
	 else
	 {
		 spotLight.visible = false;
		 scene.remove(spotLight);
	 }
	 sLight =! sLight;
 };
 document.getElementById("yesButton").onclick = function()
 {
	 yes =! yes;
 };
 document.getElementById("noButton").onclick = function()
 {
	 no =! no;
 };
 document.getElementById("waveButton").onclick = function()
 {
	 wave =! wave;
 }
 document.getElementById("walkButton").onclick = function()
 {
	 walk =! walk;
 }
 document.getElementById("runButton").onclick = function()
 {
	 run =! run;
 }
 document.getElementById("walkRightButton").onclick = function()
 {
	 walkX =! walkX;
 }
}

// add ground
var groundGeometry = new THREE.PlaneGeometry(256,256);
//var groundMat = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
//groundMat.color.setHSL( 0.25, 1, 0.25 );
var ground = new THREE.Mesh( groundGeometry, grassMaterial );
ground.rotation.x = -Math.PI/2;
ground.position.y = -3.5;     
ground.position.z = -3.5;        
ground.receiveShadow = true;
ground.needsUpdate = true;
ground.add(body);

//add sky
var skyTexture = new THREE.TextureLoader().load("sky.jpg");
var skyMaterial = new THREE.MeshPhongMaterial({map: skyTexture});
skyMaterial.side = THREE.BackSide;
var skyGeometry = new THREE.SphereGeometry(256,256);
var sky = new THREE.Mesh(skyGeometry, skyMaterial);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function animate()   
{
	requestAnimationFrame( animate );
	render();
};
// this is where the animation gets going 
var direction = 1;
function sayYes()
{
	head.rotation.x += direction * 0.01;
		if(head.rotation.x > 10 * Math.PI/180)
		{
			direction = -1;
			head.rotation.x = 2 * (10* Math.PI/180) - head.rotation.x;
		}
		else if(head.rotation.x < - 22 * Math.PI/180)
		{
			direction = 1;
			head.rotation.x = 2*(-22*Math.PI/180) - head.rotation.x;
		}
		renderer.render(scene,camera);
};
function sayNo()
{
	head.rotation.y += direction * 0.01;
	if(head.rotation.y > 10 * Math.PI/180)
	{
		direction = -1;
		head.rotation.y = 2 * (10* Math.PI/180) - head.rotation.y;
	}
	else if(head.rotation.y < - 22 * Math.PI/180)
	{
		direction = 1;
		head.rotation.y = 2*(-22*Math.PI/180) - head.rotation.y;
	}
	renderer.render(scene,camera);
};

function waveHand()
{
	leftArm.position.set(sizes.bodyW/2 + sizes.armW/2,sizes.bodyH/100 + 0.25,0);
	leftArm.rotation.z += direction * 0.01;
	if(leftArm.rotation.z > 5 * Math.PI/180)
	{
		direction = -1;
		leftArm.rotation.z = 2 * (5* Math.PI/180) - leftArm.rotation.z;
	}
	else if(leftArm.rotation.z < - 10 * Math.PI/180)
	{
		direction = 1;
		leftArm.rotation.z = 2*(-10*Math.PI/180) - leftArm.rotation.z;
	}
	renderer.render(scene,camera);
};

var updatePosition = 1;
//FOR WALKING
function moveFigure()
{
	leftArm.rotation.x += direction *  0.01;
	rightArm.rotation.x -=  direction * 0.01;
	leftLeg.rotation.x += direction * 0.01;
	rightLeg.rotation.x -= direction * 0.01;

	body.translateY(-0.003);
	body.translateZ(0.003);
	
	if(leftArm.rotation.x > 10 * Math.PI/180)
	{
		direction = -1;
		leftArm.rotation.x = 2 * (10* Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (10 * Math.PI/180) - leftLeg.rotation.x;
		
	}
	else if(leftArm.rotation.x < - 22 * Math.PI/180)
	{
		direction = 1;
		leftArm.rotation.x = 2 * (-22*Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (-22*Math.PI/180) - leftLeg.rotation.x;
	}
}
function walkRight()
{
	
	leftArm.rotation.x += direction *  0.01;
	rightArm.rotation.x -=  direction * 0.01;
	leftLeg.rotation.x += direction * 0.01;
	rightLeg.rotation.x -= direction * 0.01;
	
	body.translateX(0.01);
	body.translateZ(0.01);
	
	if(leftArm.rotation.x > 10 * Math.PI/180)
	{
		direction = -1;
		leftArm.rotation.x = 2 * (10* Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (10 * Math.PI/180) - leftLeg.rotation.x;
		
	}
	else if(leftArm.rotation.x < - 22 * Math.PI/180)
	{
		direction = 1;
		leftArm.rotation.x = 2 * (-22*Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (-22*Math.PI/180) - leftLeg.rotation.x;
	}
}
function moveFaster()
{
	leftArm.rotation.x += direction *  0.02;
	rightArm.rotation.x -=  direction * 0.02;
	leftLeg.rotation.x += direction * 0.02;
	rightLeg.rotation.x -= direction * 0.02;

	body.translateY(-0.02);
	body.translateZ(0.02);
	if(leftArm.rotation.x > 20 * Math.PI/180)
	{
		direction = -1;
		leftArm.rotation.x = 2 * (20* Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (20 * Math.PI/180) - leftLeg.rotation.x;
		
	}
	else if(leftArm.rotation.x < - 22 * Math.PI/180)
	{
		direction = 1;
		leftArm.rotation.x = 2 * (-22*Math.PI/180) - leftArm.rotation.x;
		leftLeg.rotation.x = 2 * (-22*Math.PI/180) - leftLeg.rotation.x;
	}
}

function render()
{
	if(yes)
	{
		
		sayYes();	
	}
	if(no)
	{
		sayNo();
	}
	if(wave)
	{
		waveHand();
	}
	if(!wave)
	{
		
	}
	else if(!wave)
	{
		leftArm.position.set(sizes.bodyW/2 + sizes.armW/2,sizes.bodyH/100,0);
	}
	if(walk)
	{
		if(body.position.y > -1.5)
		{
			moveFigure();
		}
	}
	if(walkX)
	{
		if(body.rotation.y < 0.7)
		{
			body.rotateY(0.5);
		}
		if(body.position.x < 5)
		{
			walkRight();	
		}
	}
	if(run)
	{
		if(body.position.y > -1.5)
		{
			moveFaster();
		}
	}
	controls.update();
	renderer.render(scene,camera);
}
//hierarchy of the parts
ground.add(body);
body.add(head);
body.add(leftArm);

body.add(rightArm);
body.add(leftLeg);
body.add(rightLeg);

scene.add(body);
scene.add(light);
scene.add(ground);
scene.add(sky);
animate();
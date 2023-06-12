import * as THREE from 'three';
// import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById("c");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x262626);

// Light
const ambientLight = new THREE.AmbientLight(0x262626, 1);
scene.add(ambientLight);

const color = 0xFFFFFF;
const intensity = 0.7;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(5, 6, 5);
scene.add(light);

const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(-5, 6, -5);
scene.add(light2);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);


// Cube
const geometry = new THREE.BoxGeometry(2, 0.3, 1);
// const material = new THREE.MeshPhongMaterial({ color: 0x00aa83 });
const loader = new THREE.TextureLoader();
const material = new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble.jpeg") });
// const material = new THREE.MeshDepthMaterial({ shadowSide: true });
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
cube.castShadow = true;
scene.add(cube);

camera.position.set(2, 3, 4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}
console.log(scene);

// Initiate function or other initializations here
animate();

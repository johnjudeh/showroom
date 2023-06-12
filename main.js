import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById("c");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const controls = new OrbitControls(camera, canvas);

function setupBackground() {
    scene.background = new THREE.Color(0x262626);
}

function setupLights() {
    const color = 0xFFFFFF;
    const intensity = 0.7;

    const ambientLight = new THREE.AmbientLight(0x262626, 1);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 6, 5);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-5, 6, -5);
    scene.add(light2);
}

function setupView() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(2, 3, 4);
    controls.enableDamping = true;

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    });
}

function setupScene() {
    setupBackground();
    setupLights();
    setupView();
}

function addVanity() {
    const geometry = new THREE.BoxGeometry(2, 0.1, 1);
    const loader = new THREE.TextureLoader();
    const materials = [
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_side.jpg") }),
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_side.jpg") }),
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_top.jpg") }), // top
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_top.jpg") }), // bottom
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_side.jpg") }),
        new THREE.MeshPhysicalMaterial({ map: loader.load("textures/marble_side.jpg") }),
    ];
    const vanity = new THREE.Mesh(geometry, materials);
    scene.add(vanity);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function main() {
    setupScene();
    addVanity();
    animate();
}

main();

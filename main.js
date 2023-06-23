import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { FontLoader } from 'three/addons/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

const canvas = document.getElementById("renderer");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
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
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.position.set(0, 2, 4);
    controls.enableDamping = true;

    window.addEventListener("resize", () => {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.render(scene, camera);
    });
}

function setupScene() {
    setupBackground();
    setupLights();
    setupView();
}

function labelVertices(mesh) {
    const loader = new FontLoader();

    loader.load("fonts/helvetiker_regular.typeface.json", (font) => {

        const createTextGeometry = (text) => new TextGeometry(text, {
            font: font,
            size: 0.05,
            height: 0.005,
        });

        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, side: THREE.DoubleSide });

        scene.add(new THREE.Mesh(createTextGeometry("(0, 0)"), material));

        const positions = mesh.geometry.getAttribute("position");
        const normals = mesh.geometry.getAttribute("normal");

        const getCoordinate = (i, axis) => positions[`get${axis.toUpperCase()}`](i) + normals[`get${axis.toUpperCase()}`](i);

        for (let v = 0; v < positions.count; v++) {

            const x = getCoordinate(v, "x");
            const y = getCoordinate(v, "y");
            const z = getCoordinate(v, "z");

            const geometry = createTextGeometry(`${v}`);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);

            scene.add(mesh);
        }
    }, undefined, (err) => console.error(err));
}

function addGeometryHelpers(mesh) {
    const normalsHelper = new VertexNormalsHelper(mesh, 1, 0xff0000);
    scene.add(normalsHelper);
    labelVertices(mesh);
}

function addVanity() {
    const geometry = new THREE.BoxGeometry(2, 0.1, 1);
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({ map: loader.load("textures/marble.jpg") });
    const vanity = new THREE.Mesh(geometry, material);
    vanity.name = "Vanity";
    scene.add(vanity);
    addGeometryHelpers(vanity);
}

export const updateVanityUV = (updatedUV) => {
    const vanity = scene.getObjectByName("Vanity");
    const uv = vanity.geometry.getAttribute("uv");
    uv.setXY(8, updatedUV.topLeft.x, updatedUV.topLeft.y);
    uv.setXY(9, updatedUV.topRight.x, updatedUV.topRight.y);
    uv.setXY(10, updatedUV.bottomLeft.x, updatedUV.bottomLeft.y);
    uv.setXY(11, updatedUV.bottomRight.x, updatedUV.bottomRight.y);
    uv.needsUpdate = true;
};

function addVanityFromGLB() {
    const loader = new GLTFLoader();
    loader.load("models/vanity.glb", (gltf) => {
        scene.add(gltf.scene);
        const baseMesh = scene.getObjectByName("Cube");
        if (baseMesh) {
            camera.position.set(2, 3, -4);
            const loader = new THREE.TextureLoader();
            const texture = loader.load("textures/marble.jpg");
            const material = new THREE.MeshPhongMaterial({ map: texture });
            baseMesh.material = material;
        }
    }, undefined, (err) => console.error(err));
}

function addBufferGeometryShape() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -1.0, -1.0, 0, // v0
        1.0, -1.0, 0, // v1
        1.0, 1.0, 0, // v2

        1.0, 1.0, 0, // v3
        -1.0, 1.0, 0, // v4
        -1.0, -1.0, 0  // v5
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

function main() {
    setupScene();
    addVanity();
    // addVanityFromGLB();
    // addBufferGeometryShape();
    render();
}

main();

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const btn = document.querySelector('button')
btn.addEventListener('click', show)

function show() {
    alert("Welcome to terabithia!");
}

// Texture loader
const loader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const height = loader.load('/height.png')
const texture = loader.load('/texture.jpg')
const alpha = loader.load('/alpha.png')



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(12, 12, 64, 64)

// Materials
const  material = new THREE.MeshStandardMaterial({
    color: 'grey',
    map: texture,
    displacementMap: height,
    displacementScale: 3,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
})



// Mesh
const plane = new THREE.Mesh(geometry,material)
plane.position.x = 10
plane.rotateX(181)
scene.add(plane)

/**
 * Environment 
 */
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( '/environmentMap/1/px.jpg')
let texture_bk = new THREE.TextureLoader().load( '/environmentMap/1/nx.jpg')
let texture_up = new THREE.TextureLoader().load( '/environmentMap/1/py.jpg')
let texture_dn = new THREE.TextureLoader().load( '/environmentMap/1/ny.jpg')
let texture_rt = new THREE.TextureLoader().load( '/environmentMap/1/pz.jpg')
let texture_lf = new THREE.TextureLoader().load( '/environmentMap/1/nz.jpg')

materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
materialArray[i].side = THREE.BackSide;
let skyboxGeo = new THREE.BoxGeometry( 100, 100, 100);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );  

// Lights
const pointLight = new THREE.PointLight(0xb1ffd6, 2)
pointLight.position.x = .2
pointLight.position.y = 10
pointLight.position.z = 4.4
scene.add(pointLight)

const col = {color: '#000000'}
gui.addColor(col, 'color').onChange(() => {
    pointLight.color.set(col.color)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = - 0
camera.position.y = -0.03
camera.position.z = 15
scene.add(camera)
gui.add(camera.position, 'x').min(-5).max(5).step(0.01)
gui.add(camera.position, 'y').min(-5).max(5).step(0.01)
gui.add(camera.position, 'z').min(-5).max(20).step(0.01)


// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.set(plane.position.x, plane.position.y, plane.position.z)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
document.addEventListener('mousemove', animateTerrain)

let mouseY = 0

function animateTerrain(event) {
    mouseY = event.clientY
}

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    plane.rotation.z = .5 * elapsedTime
    plane.material.displacementScale = 3 + mouseY * 0.005

    skybox.rotation.y = 0.1 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
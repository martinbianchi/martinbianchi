import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { RubikCube } from "./objects";

const backgroundColor = 0xdddddd;

const rubikCube = new RubikCube();
export const onResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  const resizer = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", resizer, false);
};

var mouse = {
  x: 0,
  y: 0,
};

export const init = () => {
  const scene = new THREE.Scene();

  //   scene.background = new THREE.Color(backgroundColor);
  scene.background = new THREE.Color(THREE.Color.NAMES.black);
  //   scene.backgroundColor = backgroundColor;
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(backgroundColor);

  onResize(camera, renderer);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   document.body.appendChild(renderer.domElement);

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera.position.x = 0;
  camera.position.z = 12;
  camera.position.y = 3;

  camera.lookAt(rubikCube.rubiksCubeGroup.position);

  // const extraLight = new THREE.SpotLight();
  // extraLight.position.set(-5, 1, 0);
  // extraLight.intensity = 0.2;
  // scene.add(extraLight);
  // initializeAmbientLightControls(gui, extraLight);
  const spotLight = new THREE.SpotLight();
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  spotLightHelper.visible = false;
  shadowCameraHelper.visible = false;

  scene.add(spotLightHelper);
  scene.add(shadowCameraHelper);

  function onMouseMove(event: MouseEvent) {
    // Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);

    spotLight.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 2));
  }

  function animate(t: number = 0) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    spotLightHelper.update();
    shadowCameraHelper.update();
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLight.shadow.camera.matrixWorldNeedsUpdate = true;
    if (onRender) onRender(t);
  }

  initSpotlight(spotLight);
  scene.add(spotLight);
  // foreverPlane(scene);

  animate();
  floatingFloor(scene, 30);

  scene.add(rubikCube.rubiksCubeGroup);

  document.addEventListener("mousemove", onMouseMove, false);

  return renderer.domElement;
};

function initSpotlight(spotLight: any) {
  //   const colorHolder = new THREE.Color(0xffffff);

  spotLight.penumbra = 0.5;
  spotLight.position.set(8, 7, 0.2);
  spotLight.distance = 0;
  spotLight.castShadow = true;
  spotLight.intensity = 5;
  spotLight.decay = 1.5;
  // spotLight.angle = 0.17;
  spotLight.angle = 40;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 25;
  spotLight.shadow.camera.right = 10;
  spotLight.shadow.camera.left = -10;
  spotLight.shadow.camera.top = 10;
  spotLight.shadow.camera.bottom = -10;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.bias = -0.01;
}

export const floatingFloor = (scene: THREE.Scene, size: number) => {
  const s = size ? size : 100;
  const geo = new THREE.BoxGeometry(s, 0.25, s, 10, 10, 10);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, -4, -1);
  mesh.receiveShadow = true;
  mesh.name = "floating-floor";
  scene.add(mesh);

  return mesh;
};

const modelAsync = () => {
  //   drawP(group, depth, size);
  //   draw2(group, depth, size, 10);
  //   draw2(group, depth, size, 20);
  //   drawp(group, depth, size, 0);
  //   drawGrid(group, depth, size);
  return rubikCube.rubiksCubeGroup;
};

let counter = 0;
let toggle = true;
const onRender = (t: number) => {
  if (counter % 100 === 0) {
    //   rubikCube.rotateAroundWorldAxis(rubikCube.rubiksCubeGroup, axis);
    if (toggle) {
      rubikCube.rotate();
    } else {
      rubikCube.rotate2();
    }

    toggle = !toggle;
  }

  rubikCube.rubiksCubeGroup.rotation.x += 0.005;
  rubikCube.rubiksCubeGroup.rotation.y += 0.005;
  rubikCube.rubiksCubeGroup.rotation.z += 0.005;

  TWEEN.update(t);
  counter++;
  // rubikCube.rubiksCubeGroup.position.setX(
  //   rubikCube.rubiksCubeGroup.position.x + 1
  // );
};

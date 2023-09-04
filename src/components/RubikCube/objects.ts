import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import * as TWEEN from "@tweenjs/tween.js";

export class Cube {
  uniforms: Record<string, any>;
  cubeGroup: THREE.Group;
  cubeMesh: THREE.Mesh;
  lineMesh: THREE.LineSegments;
  constructor(
    xOffset: number,
    yOffset: number,
    zOffset: number,
    color: string
  ) {
    this.cubeGroup = new THREE.Group();
    this.uniforms = {
      opacity: {
        type: "f",
        value: 1.0,
      },
    };

    const geometry = new RoundedBoxGeometry(1, 1, 1, 10, 0.2);
    // const material = new THREE.ShaderMaterial({
    //   transparent: true,
    //   uniforms: this.uniforms,
    //   vertexShader: vertexShader(),
    //   fragmentShader: fragmentShader(),
    // });

    console.log({ color });
    const material = new THREE.MeshStandardMaterial({
      emissive: "000000",
      emissiveIntensity: 1.12,
      roughness: 0.52,
      metalness: 1,
      color,
    });
    // const material = new THREE.MeshStandardMaterial({
    //   emissive: "000000",
    //   emissiveIntensity: 1,
    //   roughness: 0.41,
    //   metalness: 1,
    //   color: "bababa",
    // });

    this.cubeMesh = new THREE.Mesh(geometry, material);

    const lineEdges = new THREE.EdgesGeometry(this.cubeMesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: "#000000" });
    this.lineMesh = new THREE.LineSegments(lineEdges, lineMaterial);

    this.cubeGroup.add(this.cubeMesh);
    // this.cubeGroup.add(this.lineMesh);
    this.cubeGroup.position.x = xOffset;
    this.cubeGroup.position.y = yOffset;
    this.cubeGroup.position.z = zOffset;
  }
}

function shuffleArray(arrayToShuffle: any[]) {
  const array = [...arrayToShuffle];
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

const COLORS = shuffleArray(
  [
    // "#000000",
    "#00ffd5",
    "#ff0000",
    "#ee00ff",
    "#0040ff",
    "#ffdd00",
  ].reduce((arr, color) => {
    arr = arr.concat(...new Array(6).fill(0).map(() => color));
    return arr;
  }, [] as string[])
);

console.log({ COLORS });

export class RubikCube {
  cubes!: Array<Cube>;
  rubiksCubeGroup: THREE.Group;
  scale = 1.5;
  cubeColors = [...COLORS];
  constructor() {
    this.rubiksCubeGroup = new THREE.Group();
    this.rubiksCubeGroup.scale.x = this.scale;
    this.rubiksCubeGroup.scale.y = this.scale;
    this.rubiksCubeGroup.scale.z = this.scale;

    this.rubiksCubeGroup.rotation.x = Math.PI / 7;
    this.rubiksCubeGroup.rotation.y = -Math.PI / 4;

    this.initializeRubiksCube();
  }

  initializeRubiksCube() {
    this.cubes = [
      // Front 2x2.
      // new Cube(-1, 1, 1),
      // new Cube(1, 1, 1),
      // new Cube(-1, -1, 1),
      // new Cube(1, -1, 1),

      // Back 2x2.
      // new Cube(-1, 1, -1),
      // new Cube(1, 1, -1),
      // new Cube(-1, -1, -1),
      // new Cube(1, -1, -1),

      // Front face.
      new Cube(-1, 1, 1, this.cubeColors.pop()),
      new Cube(0, 1, 1, this.cubeColors.pop()),
      new Cube(1, 1, 1, this.cubeColors.pop()),
      new Cube(-1, 0, 1, this.cubeColors.pop()),
      new Cube(0, 0, 1, this.cubeColors.pop()),
      new Cube(1, 0, 1, this.cubeColors.pop()),
      new Cube(-1, -1, 1, this.cubeColors.pop()),
      new Cube(0, -1, 1, this.cubeColors.pop()),
      new Cube(1, -1, 1, this.cubeColors.pop()),

      // Middle face.
      new Cube(-1, 1, 0, this.cubeColors.pop()),
      new Cube(0, 1, 0, this.cubeColors.pop()),
      new Cube(1, 1, 0, this.cubeColors.pop()),
      new Cube(-1, 0, 0, this.cubeColors.pop()),
      new Cube(0, 0, 0, this.cubeColors.pop()),
      new Cube(1, 0, 0, this.cubeColors.pop()),
      new Cube(-1, -1, 0, this.cubeColors.pop()),
      new Cube(0, -1, 0, this.cubeColors.pop()),
      new Cube(1, -1, 0, this.cubeColors.pop()),

      // Back face.
      new Cube(-1, 1, -1, this.cubeColors.pop()),
      new Cube(0, 1, -1, this.cubeColors.pop()),
      new Cube(1, 1, -1, this.cubeColors.pop()),
      new Cube(-1, 0, -1, this.cubeColors.pop()),
      new Cube(0, 0, -1, this.cubeColors.pop()),
      new Cube(1, 0, -1, this.cubeColors.pop()),
      new Cube(-1, -1, -1, this.cubeColors.pop()),
      new Cube(0, -1, -1, this.cubeColors.pop()),
      new Cube(1, -1, -1, this.cubeColors.pop()),
    ];

    this.cubes.forEach((cube) => {
      this.rubiksCubeGroup.add(cube.cubeGroup);
    });
  }

  cubeInSameY(c1, c2) {
    return (
      c1.cubeGroup.position.y > c2.cubeGroup.position.y - 0.5 &&
      c1.cubeGroup.position.y < c2.cubeGroup.position.y + 0.5
    );
  }

  cubeInSameX(c1, c2) {
    return (
      c1.cubeGroup.position.x > c2.cubeGroup.position.x - 0.5 &&
      c1.cubeGroup.position.x < c2.cubeGroup.position.x + 0.5
    );
  }

  cubeInSameZ(c1, c2) {
    return (
      c1.cubeGroup.position.z > c2.cubeGroup.position.z - 0.5 &&
      c1.cubeGroup.position.z < c2.cubeGroup.position.z + 0.5
    );
  }

  rotate() {
    const axis = new THREE.Vector3(0, -1, 0);
    this.cubes.forEach((cube) => {
      if (this.cubeInSameY(cube, this.cubes[0]))
        this.rotateAroundWorldAxis(cube.cubeGroup, axis);
    });
  }

  rotate2() {
    const axis = new THREE.Vector3(-1, 0, 0);
    this.cubes.forEach((cube) => {
      if (this.cubeInSameX(cube, this.cubes[15]))
        this.rotateAroundWorldAxis(cube.cubeGroup, axis);
    });
  }

  rotateAroundWorldAxis(cubeGroup: THREE.Group, axis: THREE.Vector3) {
    const start = { rotation: 0 };
    const prev = { rotation: 0 };
    const end = { rotation: Math.PI / 2 };

    const tween = new TWEEN.Tween(start)
      .to(end, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(({ rotation }) => {
        // NOTE: Comment out each block to see different mistakes.

        // === 1 ===
        // cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);

        // === 2 ===
        // cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);

        // === 3 ===
        // NOTE: DO NOT rotate the cube on it's own axis.
        // cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
        // cubeGroup.rotateOnAxis(axis, rotation - prev.rotation);

        // === 4 ===
        // NOTE: THIS IS CORRECT.
        // NOTE: Move the position of a cube.
        // NOTE: Rotate the cube on the world axis.
        cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
        cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);

        // NOTE: Keep track of the previous rotation for tweening.
        prev.rotation = rotation;
      });

    tween.start();
  }
}

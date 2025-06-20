import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import axios from '@/lib/axios';
import DataModel from '../core/DataModel';
import { setupObjectMovement } from './ObjectMovement';
import { addDynamicGround } from './addDynamicGround'; 
import { setupLighting } from './setupLighting';
import { addGridLightsToFloor } from './realism/addGridLightsToFloor';

import { initRealismPack } from './realism/initRealismPack'; // ✅ already imported

import { createMaterialForElement } from './realism/createMaterialForElement';



const ThreeDViewer = forwardRef(({ onWallSelect }, ref) => {
  const mountRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const controlsRef = useRef(null);
  const wallsGroup = useRef(new THREE.Group());
  const floorsGroup = useRef(new THREE.Group());
  const selectedWallRef = useRef(null);
  const sceneRef = useRef(null);
  const selectedObjectRef = useRef(null);
  const previousSelectionRef = useRef(null);
  const selectionStagedRef = useRef(false);
  const isGrabbingRef = useRef(false);
  const isRotatingRef = useRef(false);
  const dragPlane = useRef(new THREE.Plane());
  const dragIntersectPoint = useRef(new THREE.Vector3());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const ceilingsGroup = useRef(new THREE.Group());
  const mainLightRef = useRef(null);



  // 🧠 Exposed Methods
  useImperativeHandle(ref, () => ({
    applyWallMaterial: async (materialId) => {
      try {
        if (!selectedWallRef.current) {
          alert("No wall selected.");
          return;
        }

        const res = await axios.get(`/api/surface/${materialId}`);
        const textureUrl = res.data?.previewUrl;
        const tileSizeX = res.data?.tileSizeX ?? 1;
        const tileSizeY = res.data?.tileSizeY ?? 1;

        if (!textureUrl) {
          alert("No preview URL found.");
          return;
        }

        const texture = new THREE.TextureLoader().load(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const mesh = selectedWallRef.current;
        const wallLength = mesh.geometry.parameters.width;
        const wallHeight = mesh.geometry.parameters.height;
        texture.repeat.set(wallLength / tileSizeX, wallHeight / tileSizeY);

        const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
        mesh.material = newMaterial;

        mesh.userData.material = {
          previewUrl: textureUrl,
          tileSizeX,
          tileSizeY,
        };
      } catch (err) {
        console.error('❌ applyWallMaterial failed:', err);
        alert('Failed to apply wall material.');
      }
    },

loadGLBModel: (url) => {
  if (!url || typeof url !== 'string') {
    console.warn("❌ Invalid GLB URL:", url);
    return;
  }

  if (!url.endsWith('.glb')) {
    console.warn("❌ URL does not look like a .glb file:", url);
    return;
  }

  console.log("🚀 Attempting to load model from:", url);

  const loader = new GLTFLoader();
loader.load(
  url,
  (gltf) => {
    const originalScene = gltf.scene;

    // 🔥 Create a single group to wrap all children
    const wrappedGroup = new THREE.Group();
    wrappedGroup.name = 'ImportedModelGroup_' + Date.now();
    wrappedGroup.userData = {
      type: 'importedModel',
      name: 'Grouped GLB',
      sourceUrl: url,
      isImportedModel: true
    };

    // 👉 Add all children from the glTF scene into the group
    originalScene.children.forEach(child => {
      wrappedGroup.add(child);
    });

    // 🧭 Optional: center the group if needed
    const box = new THREE.Box3().setFromObject(wrappedGroup);
    const center = box.getCenter(new THREE.Vector3());
    wrappedGroup.position.sub(center); // move to origin
    wrappedGroup.position.set(0, 0, 0); // or manual offset

    // ✨ Add to scene
    sceneRef.current.add(wrappedGroup);
  },
  undefined,
  (err) => {
    console.error('❌ Failed to load GLB model:', err);
  }
);

}

  }));

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    mountRef.current.__threeScene = scene;
    scene.add(ceilingsGroup.current);


    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; // 🌞 Brighter exposure
    mount.appendChild(renderer.domElement);

setupLighting(scene, renderer, mainLightRef);

    let composer = null;

initRealismPack({ renderer, scene, camera }).then((result) => {
  composer = result.composer;
  scene.environment = result.environment; // ← this makes materials reflect light
});


    // ✅ Correct placement — assign after declaration
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Render floors
    const { floors, walls } = DataModel.getFor3D();
    floorsGroup.current.clear?.();

    floors.forEach((floor) => {
      if (!floor.points || floor.points.length < 3) return;

      const shape = new THREE.Shape();
      floor.points.forEach((pt, idx) =>
        idx === 0 ? shape.moveTo(pt.x, pt.z) : shape.lineTo(pt.x, pt.z)
      );

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.rotateX(-Math.PI / 2);

      const shapePoints = shape.getPoints();
      const box2 = new THREE.Box2().setFromPoints(shapePoints);
      const sizeX = box2.max.x - box2.min.x || 1;
      const sizeZ = box2.max.y - box2.min.y || 1;
      const tileSize = floor.tileSizeX || floor.tileSizeY || 1;

const material = createMaterialForElement({
  type: 'floor',
  textureUrl: floor.material?.previewUrl,
  tileSizeX: floor.tileSizeX,
  tileSizeY: floor.tileSizeY,
  color: floor.material?.colorCode,
  isGlass: floor.material?.isGlass,
});



      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0.01, 0);
      mesh.receiveShadow = true;
material.side = THREE.DoubleSide;
      mesh.userData = {
        type: 'floor',
        name: floor.name || 'Unnamed Floor',
        height: 0.01,
        material: floor.material || null,
      };

      floorsGroup.current.add(mesh);
      const ceilingGeometry = geometry.clone();
const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: '#f0f0f0',
  side: THREE.DoubleSide,
  roughness: 0.4,
  metalness: 0.05,
});

// ✅ Auto-match ceiling height to wall
const ceilingHeight = walls[0]?.metadata?.height || 3;
const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingMesh.position.set(0, ceilingHeight, 0);

ceilingMesh.userData = {
  type: 'ceiling',
  name: floor.name ? `${floor.name} Ceiling` : 'Ceiling',
};

ceilingsGroup.current.add(ceilingMesh);

    });

    scene.add(floorsGroup.current);

    // Render walls
    wallsGroup.current.clear?.();
walls.forEach((wall) => {
  const start = wall.metadata?.start;
  const end = wall.metadata?.end;
  const height = wall.metadata?.height || 3;
  const thickness = wall.metadata?.thickness || 0.2;

  if (!start || !end) return;

  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);

  const geometry = new THREE.BoxGeometry(length, height, thickness);
  geometry.translate(length / 2, height / 2, 0);

 const wallMaterial = createMaterialForElement({
  type: 'wall',
  textureUrl: wall.metadata?.material?.previewUrl,
  tileSizeX: wall.metadata?.tileSizeX,
  tileSizeY: wall.metadata?.tileSizeY,
  color: wall.metadata?.material?.colorCode,
    reflecting: wall.metadata?.material?.reflecting ?? 10, // 👈 ADD THIS
});


  const mesh = new THREE.Mesh(geometry, wallMaterial);
  mesh.position.set(start.x, 0, start.z);
  mesh.rotation.y = -angle;

  // ✅ Enable realistic lighting
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData = {
    ...wall.metadata,
    type: 'wall',
    id: wall.id,
    name: wall.metadata?.name || 'Unnamed Wall',
material: {
  ...wall.metadata?.material,
  tileSizeX: wall.metadata?.tileSizeX,
  tileSizeY: wall.metadata?.tileSizeY,
  colorCode: wall.metadata?.material?.colorCode,
  reflecting: wall.metadata?.material?.reflecting ?? 10,
},
  };

  wallsGroup.current.add(mesh);
});


    scene.add(wallsGroup.current);
    addDynamicGround(scene);


    // Camera fit
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    camera.position.copy(center.clone().add(new THREE.Vector3(size / 2, size / 2, size / 2)));
    camera.lookAt(center);
    controls.target.copy(center);

    // 👇 Optional selection (legacy, can remove if redundant)
    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);

  const intersects = raycaster.current.intersectObjects(
  [
    ...wallsGroup.current.children,
    ...floorsGroup.current.children,
...ceilingsGroup.current.children
  ],
  true
);


      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        if (clickedObj.userData?.type === 'wall') {
          selectedWallRef.current = clickedObj;
        }
        if (typeof onWallSelect === 'function') {
          onWallSelect(clickedObj);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
if (composer) {
  composer.render();
} else {
  renderer.render(scene, camera); // fallback
}
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener('click', handleClick);
      mount.removeChild(renderer.domElement);
    };
  }, [onWallSelect]);

  useEffect(() => {
    if (
      !rendererRef.current ||
      !cameraRef.current ||
      !sceneRef.current ||
      !wallsGroup.current ||
      !floorsGroup.current
    )
      return;

    const { bindEvents, unbindEvents } = setupObjectMovement({
      renderer: rendererRef.current,
      camera: cameraRef.current,
      scene: sceneRef.current,
      wallsGroup: wallsGroup.current,
      floorsGroup: floorsGroup.current,
      selectedObjectRef,
      previousSelectionRef,
      selectionStagedRef,
      isGrabbingRef,
      isRotatingRef,
      dragPlane,
      dragIntersectPoint,
      mouse: mouse.current,
      raycaster: raycaster.current,
      onWallSelect,
    });

    bindEvents();
    return () => unbindEvents();
  }, []);


useEffect(() => {
  const handleKeyDown = (e) => {
    const selected = selectedObjectRef.current;
    if (!selected) return;

    const type = selected.userData?.type;
    if (type === 'wall' || type === 'floor') return; // 🔐 block

    if (e.key === 'p') {
      selected.scale.multiplyScalar(1.1);
    } else if (e.key === 'o') {
      selected.scale.multiplyScalar(0.9);
    } else if (e.key === 'b') {
      if (selected.parent) {
        selected.parent.remove(selected);
        selectedObjectRef.current = null;
        selectedWallRef.current = null;
        console.log("🗑️ Deleted selected object");
      }
    }
  };



  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

useEffect(() => {
  const handleLightControl = (e) => {
    const light = mainLightRef.current;
    if (!light) return;

    if (e.key === '0') {
      light.intensity = Math.min(light.intensity + 0.2, 5); // cap at 5
      console.log('🔆 Increased light intensity:', light.intensity);
    } else if (e.key === '9') {
      light.intensity = Math.max(light.intensity - 0.2, 0); // floor at 0
      console.log('🌑 Decreased light intensity:', light.intensity);
    }
  };

  window.addEventListener('keydown', handleLightControl);
  return () => window.removeEventListener('keydown', handleLightControl);
}, []);





  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
});

export default ThreeDViewer;

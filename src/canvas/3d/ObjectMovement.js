import * as THREE from 'three';

export function setupObjectMovement({
  renderer,
  camera,
  scene,
  wallsGroup,
  floorsGroup,
  selectedObjectRef,
  previousSelectionRef,
  selectionStagedRef,
  isGrabbingRef,
  isRotatingRef,
  dragPlane,
  dragIntersectPoint,
  mouse,
  raycaster,
  onWallSelect,
}) {
  const activeAxisRef = { current: null }; // 'x' | 'y' | 'z' | null
  const isScalingRef = { current: false };
  const initialScaleRef = { current: null };
  const initialMouseX = { current: 0 };

  const lastConfirmedScaleRef = { current: null };

  

  const handleClick = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (isScalingRef.current && selectedObjectRef.current) {
  lastConfirmedScaleRef.current = selectedObjectRef.current.scale.clone();
  isScalingRef.current = false;
  activeAxisRef.current = null;
}


    const allMeshes = [
      ...wallsGroup.children,
      ...floorsGroup.children,
      ...scene.children.filter(obj => obj.userData?.isImportedModel)
    ];

    const intersects = raycaster.intersectObjects(allMeshes, true);

    if (intersects.length === 0) {
      clearSelection();
      return;
    }

    if (selectionStagedRef.current) {
      selectionStagedRef.current = false;
      return;
    }

    let target = intersects[0].object;
    while (target.parent && !target.userData?.type && !target.userData?.isImportedModel) {
      target = target.parent;
    }

    clearSelection();

    previousSelectionRef.current = target;
    selectedObjectRef.current = target;
    selectionStagedRef.current = true;

    if (typeof onWallSelect === 'function') onWallSelect(target);
  };

  const clearSelection = () => {
    isGrabbingRef.current = false;
    isRotatingRef.current = false;
    isScalingRef.current = false;
    activeAxisRef.current = null;

    if (previousSelectionRef.current) {
      const prev = previousSelectionRef.current;
      if (prev.material && prev.userData?.originalColor) {
        prev.material.color.set(prev.userData.originalColor);
      }
      if (prev.userData?.originalMaterial) {
        prev.material = prev.userData.originalMaterial;
      }
    }

    previousSelectionRef.current = null;
    selectedObjectRef.current = null;
    selectionStagedRef.current = false;
  };

 const handleKeyDown = (e) => {
  const selected = selectedObjectRef.current;
  if (!selected) return;

  const type = selected.userData?.type;
  if (type === 'wall' || type === 'floor') {
    if (e.key === 'Escape') clearSelection(); // allow Escape
    return;
  }

  if (e.key === 'g') {
    isGrabbingRef.current = true;
    isScalingRef.current = false;
    isRotatingRef.current = false;
    activeAxisRef.current = null;
  }

  if (e.key === 'r') {
    isRotatingRef.current = true;
    isGrabbingRef.current = false;
    isScalingRef.current = false;
    activeAxisRef.current = null;
  }

  if (e.key === 's') {
    isScalingRef.current = true;
    isGrabbingRef.current = false;
    isRotatingRef.current = false;
    activeAxisRef.current = null;

    initialScaleRef.current = selected.scale.clone();
    lastConfirmedScaleRef.current = selected.scale.clone();
    initialMouseX.current = window.event?.clientX || 0;
  }

  if (['x', 'y', 'z'].includes(e.key)) {
    activeAxisRef.current = e.key;
  }

  if (e.key === 'Escape') {
    if (isScalingRef.current && initialScaleRef.current) {
      selected.scale.copy(initialScaleRef.current);
    }
    clearSelection();
  }
};


const handleMouseMove = (e) => {
  const selected = selectedObjectRef.current;
  if (!selected) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const moveSpeed = 0.05;
  const delta = new THREE.Vector3();

  // 🟢 Movement
  if (isGrabbingRef.current) {
    if (activeAxisRef.current === 'x') {
      delta.set(e.movementX * moveSpeed, 0, 0);
    } else if (activeAxisRef.current === 'z') {
      delta.set(0, e.movementY * -moveSpeed, 0); // Z key = vertical
    } else if (activeAxisRef.current === 'y') {
      delta.set(0, 0, e.movementX * moveSpeed); // Y key = depth
    } else {
      if (raycaster.ray.intersectPlane(dragPlane.current, dragIntersectPoint.current)) {
        selected.position.copy(dragIntersectPoint.current);
        return;
      }
    }

    selected.position.add(delta);
  }

  // 🟣 Scaling
if (isScalingRef.current && initialScaleRef.current) {
  const deltaX = e.movementX;
  const scaleDelta = deltaX * 0.1;
  const scaleFactor = 1 + scaleDelta;

  const selected = selectedObjectRef.current;
  const base = initialScaleRef.current;

  const clamped = Math.min(2, Math.max(0.5, scaleFactor));

  if (activeAxisRef.current === 'x') {
    selected.scale.x = base.x * clamped;
  } else if (activeAxisRef.current === 'z') {
    selected.scale.y = base.y * clamped;
  } else if (activeAxisRef.current === 'y') {
    selected.scale.z = base.z * clamped;
  } else {
    selected.scale.set(
      base.x * clamped,
      base.y * clamped,
      base.z * clamped
    );
  }
}





  // 🔵 Rotation (pivot = object's own center)
  if (isRotatingRef.current) {
    const rotationSpeed = 0.01;

    if (activeAxisRef.current === 'x') {
      selected.rotation.x += e.movementX * rotationSpeed;
    } else if (activeAxisRef.current === 'z') {
      selected.rotation.y += e.movementX * rotationSpeed; // Z key = Y-axis rotation (vertical)
    } else if (activeAxisRef.current === 'y') {
      selected.rotation.z += e.movementX * rotationSpeed; // Y key = Z-axis rotation (depth)
    } else {
      selected.rotation.y += e.movementX * rotationSpeed; // Default: Y-axis (turn left/right)
    }
  }
};





  const handleMouseDown = () => {
    if (!selectedObjectRef.current || !isGrabbingRef.current) return;

    const normal = camera.getWorldDirection(new THREE.Vector3()).clone().negate();
    const point = selectedObjectRef.current.position.clone();
    dragPlane.current.setFromNormalAndCoplanarPoint(normal, point);
  };

  const bindEvents = () => {
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
  };

  const unbindEvents = () => {
    renderer.domElement.removeEventListener('click', handleClick);
    renderer.domElement.removeEventListener('mousemove', handleMouseMove);
    renderer.domElement.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('keydown', handleKeyDown);
  };

  return { bindEvents, unbindEvents };
}
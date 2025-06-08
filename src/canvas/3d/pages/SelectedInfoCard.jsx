import React, { useState, useEffect } from 'react';
import { FiLayers } from 'react-icons/fi';
import axios from 'axios';
import * as THREE from 'three';
import DataModel from '@/canvas/core/DataModel';
import { useTranslation } from "react-i18next";

const SelectedInfoCard = ({ selectedWall }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentWall, setCurrentWall] = useState(null);
  const [wallName, setWallName] = useState('');
  const [assetInput, setAssetInput] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [materialInfo, setMaterialInfo] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const [reflecting, setReflecting] = useState(10); 



  useEffect(() => {
  if (selectedWall) {
    setExpanded(true);
    setCurrentWall(selectedWall);
    setWallName(selectedWall.userData?.name || '');
    setAssetInput(selectedWall.userData?.material?.id || '');
    setColorCode(selectedWall.userData?.colorCode || '');
    setError('');
    setMaterialInfo(null);
    setReflecting(selectedWall.userData?.material?.reflecting ?? 10); // ✅ Load reflecting from saved data
  }
}, [selectedWall]);

  useEffect(() => {
    const value = assetInput.trim();

    if (value.length === 24 && /^[a-f\d]{24}$/i.test(value)) {
      axios
        .get(`http://localhost:4000/api/assets/${value}`)
        .then((res) => setMaterialInfo(res.data))
        .catch((err) => {
          console.error('Failed to load asset by ID:', err);
          setMaterialInfo(null);
        });
    } else if (value.startsWith('http')) {
      setMaterialInfo((prev) => ({
        ...(prev || {}),
        id: 'custom-url',
        name: 'Custom Image',
        category: 'manual',
        previewUrl: value,
        width: prev?.width || 1,
        height: prev?.height || 1,
      }));
    } else {
      setMaterialInfo(null);
    }
  }, [assetInput]);

const applyMaterialToMesh = (mesh, textureUrl, tileSizeX, tileSizeY, reflectValue = 10) => {
  if (!mesh || !textureUrl) return;

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  loader.load(textureUrl, (texture) => {
    if (mesh.material?.map) mesh.material.map.dispose();
    if (mesh.material) mesh.material.dispose();

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    mesh.material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 1 - reflectValue / 30, // ← more reflect = lower roughness
      metalness: 0.05 + reflectValue / 100, // slight shine increase
    });

    const geometryParams = mesh.geometry?.parameters || {};
    const wallLength = geometryParams.width || 1;
    const wallHeight = geometryParams.height || 1;
    texture.repeat.set(wallLength / tileSizeX, wallHeight / tileSizeY);
    mesh.material.needsUpdate = true;
  });
};


  const handleApply = () => {
    if (!assetInput && !colorCode && !wallName.trim()) {
      setError(t("wallCard.errorMissing"));
      return;
    }

    setError('');
    currentWall.userData.name = wallName;
    currentWall.userData.colorCode = colorCode;

    if (materialInfo?.previewUrl) {
      const materialData = {
        id: materialInfo.id,
        name: materialInfo.name,
        category: materialInfo.category,
        previewUrl: materialInfo.previewUrl,
        width: materialInfo.width || 1,
        height: materialInfo.height || 1,
          reflecting: reflecting, // ✅ add this
      };

      currentWall.userData.material = materialData;
      currentWall.userData.tileSizeX = materialData.width;
      currentWall.userData.tileSizeY = materialData.height;

      if (currentWall?.isMesh) {
                applyMaterialToMesh(
          currentWall,
          materialInfo.previewUrl,
          materialInfo.width || 1,
          materialInfo.height || 1,
          reflecting
        );
currentWall.userData.material.reflecting = reflecting;

      }
    }

if (colorCode) {
  const color = new THREE.Color(colorCode);

  // ⛑️ Store in userData for persistence
  currentWall.userData.material = {
    ...currentWall.userData.material,
    colorCode,
    type: 'color',
    reflecting,
  };

  currentWall.userData.colorCode = colorCode;

  // 🔥 Always create a new material (even if one exists)
  const newMaterial = new THREE.MeshStandardMaterial({
    color,
    side: THREE.DoubleSide,
    roughness: 1 - reflecting / 30,
    metalness: 0.05 + reflecting / 100,
    envMapIntensity: 2.0,
  });

  // 🧼 Clean old one
  if (currentWall.material?.dispose) {
    currentWall.material.dispose();
  }

  currentWall.material = newMaterial;
  currentWall.material.needsUpdate = true;
}



    if (window.__fabricCanvas) {
      const objects = window.__fabricCanvas.getObjects();
      const wallId = currentWall?.id || currentWall?.name;

      for (let obj of objects) {
        if (obj.type === 'polygon' && (obj.id === wallId || obj.name === wallId)) {
          obj.userData = {
            ...currentWall.userData,
            tileSizeX: materialInfo?.width || 1,
            tileSizeY: materialInfo?.height || 1,
            material: currentWall.userData.material,
          };
          obj.tileSizeX = materialInfo?.width || 1;
          obj.tileSizeY = materialInfo?.height || 1;
          obj.material = currentWall.userData.material;
          break;
        }
      }

      DataModel.updateFromCanvas(window.__fabricCanvas);
    }

    window.dispatchEvent(new Event('refresh-3d-view'));
    console.log('📦 Applied:', currentWall.userData);
  };

  if (!currentWall) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-neutral-800 shadow-lg rounded-xl">
          <FiLayers className="text-2xl text-black dark:text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-xl rounded-xl">
        <div
          className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-800 cursor-pointer select-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <FiLayers className="text-xl" />
          <input
            type="text"
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
            placeholder={t("wallCard.wallNamePlaceholder")}
            className="flex-1 bg-transparent text-sm font-semibold border-none outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {expanded && (
          <div className="p-4 space-y-3">
            <div>
<label className="text-xs text-neutral-500">{t("wallCard.assetLabel")}</label>
              <input
                type="text"
                value={assetInput}
                onChange={(e) => setAssetInput(e.target.value)}
                className="w-full text-sm bg-white dark:bg-neutral-800 border px-2 py-1 rounded"
                placeholder={t("wallCard.assetPlaceholder")}
              />
            </div>

            {materialInfo && (
              <>
                <div className="p-2 border rounded bg-neutral-800 text-white">
                  <img
                    src={materialInfo.previewUrl}
                    alt="Material Preview"
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/no-image.jpg';
                    }}
                  />
                  <p className="font-bold">{materialInfo.name || 'Unnamed'}</p>
                  <p className="text-xs">{materialInfo.category} | {materialInfo.width}m × {materialInfo.height}m</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-500">{t("wallCard.tileWidth")}</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
value={materialInfo?.width ?? ''}
                      onChange={(e) =>
                        setMaterialInfo({ ...materialInfo, width: parseFloat(e.target.value) })
                      }
                      className="w-full text-sm bg-white dark:bg-neutral-800 border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">{t("wallCard.tileHeight")}</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
value={materialInfo?.height ?? ''}
                      onChange={(e) =>
                        setMaterialInfo({ ...materialInfo, height: parseFloat(e.target.value) })
                      }
                      className="w-full text-sm bg-white dark:bg-neutral-800 border px-2 py-1 rounded"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-neutral-500">{t("wallCard.colorLabel")}</label>
              <input
                type="text"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="w-full text-sm bg-white dark:bg-neutral-800 border px-2 py-1 rounded"
                placeholder="#ffffff"
              />
            </div>

            <div>
  <label className="text-xs text-neutral-500">Reflecting</label>
  <input
    type="range"
    min="0"
    max="30"
    value={reflecting}
    onChange={(e) => setReflecting(parseInt(e.target.value))}
    className="w-full"
  />
  <p className="text-xs mt-1">{reflecting}</p>
</div>


            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              onClick={handleApply}
              className="w-full py-2 bg-black text-white text-sm rounded mt-2 hover:opacity-90"
            >
              {t("wallCard.apply")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedInfoCard;

// src/Model.jsx
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import React, { forwardRef } from 'react';

const Model = forwardRef(({ path, ...props }, ref) => {
  const materials = useLoader(MTLLoader, `${path}.mtl`);
  const obj = useLoader(OBJLoader, `${path}.obj`, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  
  return (
    <primitive
    object={obj}
    ref={ref}
    scale={0.000023}
      {...props}
    />
  );
});

export default Model;

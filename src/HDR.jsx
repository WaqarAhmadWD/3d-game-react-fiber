import React, { useEffect } from 'react'
import { Canvas, useThree, useLoader } from '@react-three/fiber'
import { EXRLoader } from 'three-stdlib' // important: not from 'three'
import { PMREMGenerator } from 'three'

export default function HDRIEnvironment() {
  const exrTexture = useLoader(EXRLoader, 'materials/HDR/DaySkyHDRI057A_1K-HDR.exr')
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmremGen = new PMREMGenerator(gl)
    pmremGen.compileEquirectangularShader()

    const envMap = pmremGen.fromEquirectangular(exrTexture).texture
    // scene.environment = envMap
    scene.background = envMap

    exrTexture.dispose()
    pmremGen.dispose()
  }, [exrTexture, gl, scene])

  return null
}

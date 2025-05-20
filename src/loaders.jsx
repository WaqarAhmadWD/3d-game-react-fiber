import { useLoader  } from "@react-three/fiber";
import { TextureLoader } from 'three'


 export const Texture = (path)=>{
    const [
    colorMap,
    aoMap,
    roughnessMap,
    displacementMap,
    normalMap
  ] = useLoader(TextureLoader, [
    `/materials${path}_1K-JPG_Color.jpg`,
    `/materials${path}_1K-JPG_AmbientOcclusion.jpg`,
    `/materials${path}_1K-JPG_Roughness.jpg`,
    `/materials${path}_1K-JPG_Displacement.jpg`,
    `/materials${path}_1K-JPG_NormalGL.jpg`
  ])
  return {colorMap,
    aoMap,
    roughnessMap,
    displacementMap,
    normalMap}
 }
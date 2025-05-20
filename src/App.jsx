import { useGameStore } from "./store/state";
import { Html } from "@react-three/drei";
import { Canvas  } from "@react-three/fiber";
import Box from "./components/Box";
import Car from "./components/Car";
import { Suspense, useEffect } from "react";
import { Texture } from "./loaders";
import HDRIEnvironment from "./HDR";
export default function App() {
  const {isGameOver,setBoxs,boxs,rand,setGameOver,} = useGameStore();
     useEffect(() => {
    setBoxs({count:100,range:[-50,50],skip:[-5,5]});
  }, [setBoxs]);
  const groundTexture = Texture("/ground/Ground080");
  const bricksTexture = Texture("/bricks/Bricks101");
  return (
    <>
      <Canvas>
          <Suspense fallback={null}>
        <HDRIEnvironment/>
  </Suspense>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={0.75} />
        <Box position={[0, 0, 0]} geometryArgs={[500, 1, 500]} materialArgs={{...groundTexture,displacementScale:0}} />

        {boxs && boxs.map((e, index) => (
          <Box key={index} position={e.position} geometryArgs={[rand(1,5), rand(1,5), rand(1,5)]} materialArgs={{...bricksTexture,displacementScale:0}}  />
        ))}

        {!isGameOver && <Car position={[0, 1, 0]}/>}
        
        {isGameOver && (
          <Html center>
            <div onClick={()=>setGameOver(false)} style={{ fontSize: '48px', cursor:'pointer', color: 'red', fontWeight: 'bold', backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              Game Over
            </div>
          </Html>
        )}
      </Canvas>
    </>
  );
}

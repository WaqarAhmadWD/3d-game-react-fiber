import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import {  OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from "../store/state";
import Model from '../model';
export default function Car(props) {
  const meshRef = useRef()
  const cameraRef = useRef()
  const keysPressed = useRef({})
  const {setGameOver,boxs,setBoxs} = useGameStore()
  // Physics state
  const velocity = useRef(0)
  const rotationSpeed = 0.04
  const acceleration = 0.002
  const maxSpeed = 0.8
  const friction = 0.98

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    const camera = cameraRef.current
    if (!mesh || !camera) return

    
    // Forward/Backward Acceleration
    if (keysPressed.current['arrowup']) {
      velocity.current = Math.max(velocity.current - acceleration, -maxSpeed / 2)
    } else 
    if (keysPressed.current['arrowdown']) {
      velocity.current = Math.min(velocity.current + acceleration, maxSpeed)
    } else {
      // velocity.current =  0.2;
      velocity.current *= friction
    }

    // Turn left/right
    if (keysPressed.current['arrowleft']) {
      mesh.rotation.y += rotationSpeed
    }
    if (keysPressed.current['arrowright']) {
      mesh.rotation.y -= rotationSpeed
    }

    // Move forward based on direction
    const direction = new THREE.Vector3(0, 0, -1)
    direction.applyEuler(mesh.rotation)
    mesh.position.addScaledVector(direction, velocity.current)
   
    // Position camera behind the mesh
   const offset = new THREE.Vector3(0, 1.5, 2) // Camera height and distance

// Create a clone of the car's rotation and rotate Y by +90°
const cameraRotation = new THREE.Euler().copy(mesh.rotation)
cameraRotation.y += Math.PI  // 90 degrees in radians

offset.applyEuler(cameraRotation)

camera.position.copy(mesh.position.clone().add(offset))
camera.lookAt(mesh.position)
    //  if (Math.abs(mesh.position.x) > 25 || Math.abs(mesh.position.z) > 25) {
    //   setGameOver(true)
    // }
    // if(mesh.position.x === 0 && mesh.position.y === 0 && mesh.position.z === 0){
    //   return;
    // }
    // Define the bounding box of the player
  const personBox = new THREE.Box3().setFromObject(mesh)

  // Check collision with each box
  for (const box of boxs) {
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2), // adjust to match your Box size
      new THREE.MeshBasicMaterial()
    )
    boxMesh.position.set(...box.position)
    const boxBox = new THREE.Box3().setFromObject(boxMesh)

    if (personBox.intersectsBox(boxBox)) {
      setGameOver(true)
      break
    }
  }
  })
useEffect(() => {
  let lastPosition = {
    x: meshRef.current.position.x,
    z: meshRef.current.position.z,
  };

  const interval = setInterval(() => {
    const current = meshRef.current.position;

    const deltaX = current.x - lastPosition.x;
    const deltaZ = current.z - lastPosition.z;

    const distanceX = Math.abs(deltaX);
    const distanceZ = Math.abs(deltaZ);

    if (distanceX >= 25 || distanceZ >= 25) {
      const stepsX = Math.floor(distanceX / 25);
      const stepsZ = Math.floor(distanceZ / 25);

      lastPosition.x += stepsX * 25 * Math.sign(deltaX);
      lastPosition.z += stepsZ * 25 * Math.sign(deltaZ);
      setBoxs({
        count: 200,
        range: [-Math.abs(current.z) - 50, current.x + 50],
        skip: [-Math.abs(current.z) - 1, current.x + 1],
      });

      console.log('Fired setBoxs at:', current);
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={100} />
      {/* <OrbitControls enabled={false} /> */}
       <Model ref={meshRef} path="/model/car/1" {...props} />
      {/* <mesh ref={meshRef} {...props}>
        <boxGeometry args={geometryArgs} />
        <meshStandardMaterial {...materialArgs} />
      </mesh> */}
    </>
  )
}

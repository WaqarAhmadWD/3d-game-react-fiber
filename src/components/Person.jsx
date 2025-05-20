import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import {  OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from "../store/state";

export default function Person({
  geometryArgs = [1, 1, 2],
  materialArgs = { color: 'orange' },
  ...props
}) {
  const meshRef = useRef()
  const cameraRef = useRef()
  const keysPressed = useRef({})
  const {setGameOver,boxs} = useGameStore((state) => state)
  // Physics state
  const velocity = useRef(0)
  const rotationSpeed = 0.04
  const acceleration = 0.002
  const maxSpeed = 0.2
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
      velocity.current = Math.min(velocity.current + acceleration, maxSpeed)
    } else if (keysPressed.current['arrowdown']) {
      velocity.current = Math.max(velocity.current - acceleration, -maxSpeed / 2)
    } else {
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
    const offset = new THREE.Vector3(0, 1, 2) // Camera height and distance
    offset.applyEuler(mesh.rotation)
    camera.position.copy(mesh.position.clone().add(offset))
    camera.lookAt(mesh.position)
     if (Math.abs(mesh.position.x) > 25 || Math.abs(mesh.position.z) > 25) {
      setGameOver(true)
    }
    if(mesh.position.x === 0 && mesh.position.y === 0 && mesh.position.z === 0){
      return;
    }
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

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />
      {/* <OrbitControls enabled={false} /> */}
      <mesh ref={meshRef} {...props}>
        <boxGeometry args={geometryArgs} />
        <meshStandardMaterial {...materialArgs} />
      </mesh>
    </>
  )
}

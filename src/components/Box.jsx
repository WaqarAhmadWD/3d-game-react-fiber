import React, { useRef } from 'react'

export default function Person({
  geometryArgs = [1, 1, 1],
  materialArgs = { color: 'orange' },
  ...props
}) {
  const meshRef = useRef()
  
  return (
    <>
      <mesh ref={meshRef} {...props}>
        <boxGeometry args={geometryArgs} />
        <meshStandardMaterial {...materialArgs} />
      </mesh>
    </>
  )
}

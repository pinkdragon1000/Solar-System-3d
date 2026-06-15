import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SUN } from '../data/planets'

export default function Sun({ selected, paused, onSelect, registry }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  const texture = useTexture(SUN.texture)
  texture.colorSpace = THREE.SRGBColorSpace

  useEffect(() => {
    if (!registry) return
    const map = registry.current
    map.set(SUN.name, ref.current)
    return () => map.delete(SUN.name)
  }, [registry])

  useFrame((_, delta) => {
    if (ref.current && !paused) ref.current.rotation.y += delta * 0.05
  })

  const active = selected || hovered

  return (
    <group>
      {/* Light cast on every planet */}
      <pointLight intensity={3} distance={200} decay={0.6} color="#fff4d6" />

      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(SUN.name)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[SUN.size, 64, 64]} />
        <meshBasicMaterial map={texture} color="#ffffff" />
      </mesh>

      {/* Glow halo */}
      <mesh scale={1.3}>
        <sphereGeometry args={[SUN.size, 32, 32]} />
        <meshBasicMaterial color="#ff9d2f" transparent opacity={0.25} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.7}>
        <sphereGeometry args={[SUN.size, 32, 32]} />
        <meshBasicMaterial color="#ff7b00" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {active && (
        <Html center distanceFactor={40} position={[0, SUN.size + 2, 0]}>
          <div className="planet-label">{SUN.name}</div>
        </Html>
      )}
    </group>
  )
}

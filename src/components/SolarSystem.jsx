import { useRef } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import Sun from './Sun'
import Planet from './Planet'
import CameraRig from './CameraRig'
import { PLANETS } from '../data/planets'

export default function SolarSystem({ selected, paused, onSelect }) {
  // name -> Object3D, so the camera rig can read each body's live world position.
  const registry = useRef(new Map())

  return (
    <>
      <ambientLight intensity={0.32} />
      <Stars radius={200} depth={80} count={6000} factor={5} saturation={0} fade speed={0.5} />

      <Sun selected={selected === 'Sun'} paused={paused} onSelect={onSelect} registry={registry} />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.name}
          planet={planet}
          selected={selected === planet.name}
          selectedName={selected}
          paused={paused}
          onSelect={onSelect}
          registry={registry}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={140}
        autoRotate={false}
        makeDefault
      />

      <CameraRig selected={selected} registry={registry} />
    </>
  )
}

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// A faint circular line marking the planet's orbital path.
function OrbitPath({ radius }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2)
    return curve.getPoints(128).map((p) => new THREE.Vector3(p.x, 0, p.y))
  }, [radius])

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  )

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#3a4566" transparent opacity={0.4} />
    </line>
  )
}

// A translucent, slowly-drifting cloud shell (Earth).
function Clouds({ url, size, paused }) {
  const ref = useRef()
  const tex = useTexture(url)
  // The cloud map is a dim white-on-black image used as an alphaMap, so it must
  // be read as *linear* data — an sRGB decode would crush the mid-gray clouds
  // into near-zero alpha and make them vanish.
  tex.colorSpace = THREE.LinearSRGBColorSpace

  useFrame((_, delta) => {
    if (ref.current && !paused) ref.current.rotation.y += delta * 0.03
  })

  // Sit the shell outside the body even when it swells to its selected/hovered
  // scale (1.08), but still inside the 1.15 atmosphere glow.
  return (
    <mesh ref={ref} scale={1.1}>
      <sphereGeometry args={[size, 48, 48]} />
      {/* White, self-lit clouds so they read on the night side too. The texture
          drives both where clouds appear (alphaMap) and their glow (emissiveMap). */}
      <meshStandardMaterial
        color="#ffffff"
        alphaMap={tex}
        emissive="#ffffff"
        emissiveMap={tex}
        emissiveIntensity={0.6}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  )
}

// Earth's textured moon — clickable and selectable like a planet.
function Moon({ moon, selected, onSelect, registry }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const tex = useTexture(moon.texture)
  tex.colorSpace = THREE.SRGBColorSpace
  const bump = useTexture(moon.bumpMap)

  useEffect(() => {
    if (!registry) return
    const map = registry.current
    map.set(moon.name, ref.current)
    return () => map.delete(moon.name)
  }, [registry, moon.name])

  const active = selected || hovered

  return (
    <mesh
      ref={ref}
      position={[moon.distance, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(moon.name)
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
      scale={active ? 1.15 : 1}
    >
      <sphereGeometry args={[moon.size, 32, 32]} />
      <meshStandardMaterial
        map={tex}
        bumpMap={bump}
        bumpScale={moon.bumpScale || 0}
        roughness={1}
        emissive="#ffffff"
        emissiveMap={tex}
        emissiveIntensity={active ? 0.2 : 0}
      />
      {active && (
        <Html center distanceFactor={18} position={[0, moon.size + 0.5, 0]}>
          <div className="planet-label">{moon.name}</div>
        </Html>
      )}
    </mesh>
  )
}

// Textured ring system (Saturn). UVs are remapped radially so the ring image
// reads as concentric bands rather than a flat square.
function TexturedRings({ rings, size }) {
  const tex = useTexture(rings.texture)
  const inner = size * rings.inner
  const outer = size * rings.outer

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 128)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const t = (v.length() - inner) / (outer - inner)
      geo.attributes.uv.setXY(i, t, 0.5)
    }
    return geo
  }, [inner, outer])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.1, 0, 0]}>
      <meshBasicMaterial
        map={tex}
        alphaMap={tex}
        color={rings.color}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Planet({
  planet,
  selected,
  selectedName,
  paused,
  onSelect,
  registry,
}) {
  const orbitRef = useRef() // rotates the whole orbit
  const holderRef = useRef() // sits at the planet's center; used to track world position
  const bodyRef = useRef() // spins the planet on its axis
  const moonRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Load the surface map plus any optional normal / bump maps for this planet.
  const maps = useTexture({
    map: planet.texture,
    ...(planet.normalMap ? { normalMap: planet.normalMap } : {}),
    ...(planet.bumpMap ? { bumpMap: planet.bumpMap } : {}),
  })
  maps.map.colorSpace = THREE.SRGBColorSpace
  maps.map.anisotropy = 8

  const tilt = THREE.MathUtils.degToRad(planet.tiltDeg || 0)

  // Give each planet a random starting position on its orbit.
  const startAngle = useMemo(() => Math.random() * Math.PI * 2, [])

  // Expose this planet's live position so the camera rig can follow it.
  useEffect(() => {
    if (!registry) return
    const map = registry.current
    map.set(planet.name, holderRef.current)
    return () => map.delete(planet.name)
  }, [registry, planet.name])

  useFrame((_, delta) => {
    if (orbitRef.current && !paused) {
      orbitRef.current.rotation.y += planet.orbitSpeed * delta * 14
    }
    if (bodyRef.current && !paused) {
      bodyRef.current.rotation.y += planet.spin * delta * 30
    }
    if (moonRef.current && !paused) {
      moonRef.current.rotation.y += (planet.moon?.orbitSpeed || 0) * delta * 14
    }
  })

  const active = selected || hovered

  return (
    <group ref={orbitRef} rotation={[0, startAngle, 0]}>
      <OrbitPath radius={planet.distance} />

      <group ref={holderRef} position={[planet.distance, 0, 0]}>
        {/* The planet body, tilted on its axis */}
        <group rotation={[0, 0, tilt]}>
          <mesh
            ref={bodyRef}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(planet.name)
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
            scale={active ? 1.08 : 1}
          >
            <sphereGeometry args={[planet.size, 64, 64]} />
            <meshStandardMaterial
              map={maps.map}
              normalMap={maps.normalMap}
              bumpMap={maps.bumpMap}
              bumpScale={planet.bumpScale || 0}
              roughness={0.9}
              metalness={0.0}
              emissive="#ffffff"
              emissiveMap={maps.map}
              emissiveIntensity={active ? 0.2 : planet.baseGlow || 0}
            />
          </mesh>

          {/* Cloud shell (Earth) */}
          {planet.clouds && (
            <Clouds url={planet.clouds} size={planet.size} paused={paused} />
          )}

          {/* Subtle atmospheric glow */}
          <mesh scale={1.15}>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshBasicMaterial
              color={planet.color}
              transparent
              opacity={active ? 0.16 : 0.07}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Rings — textured (Saturn) or simple colored (Uranus) */}
          {planet.rings &&
            (planet.rings.texture ? (
              <TexturedRings rings={planet.rings} size={planet.size} />
            ) : (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry
                  args={[
                    planet.size * planet.rings.inner,
                    planet.size * planet.rings.outer,
                    64,
                  ]}
                />
                <meshBasicMaterial
                  color={planet.rings.color}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}
        </group>

        {/* Earth's moon */}
        {planet.moon && (
          <group ref={moonRef}>
            <Moon
              moon={planet.moon}
              selected={selectedName === planet.moon.name}
              onSelect={onSelect}
              registry={registry}
            />
          </group>
        )}

        {/* Name label on hover or selection */}
        {active && (
          <Html center distanceFactor={28} position={[0, planet.size * 1.3 + 0.2, 0]}>
            <div className="planet-label">{planet.name}</div>
          </Html>
        )}
      </group>
    </group>
  )
}

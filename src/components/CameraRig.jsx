import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SUN, PLANETS, MOON } from '../data/planets'

const SIZES = Object.fromEntries(
  [SUN, ...PLANETS, MOON].map((b) => [b.name, b.size])
)

// The default overview camera pose (matches the initial <Canvas camera>).
const HOME_POS = new THREE.Vector3(0, 44, 88)
const ORIGIN = new THREE.Vector3(0, 0, 0)

// Animates the camera + OrbitControls target to focus the selected body, then
// keeps it centered as it orbits while leaving the user free to rotate/zoom.
// When nothing is selected, it flies back out to the overview.
export default function CameraRig({ selected, registry }) {
  const { camera, controls, size } = useThree()
  const framing = useRef(false)
  const returning = useRef(false)
  const prevSelected = useRef(null)

  const worldPos = useRef(new THREE.Vector3()).current
  const dir = useRef(new THREE.Vector3()).current
  const desired = useRef(new THREE.Vector3()).current

  useFrame(() => {
    if (!controls) return

    const bottomSheet = window.innerWidth <= 1024 // bottom-sheet layout

    // On phones & tablets the info panel is a bottom sheet, so push the framed
    // planet up into the visible space above it (rather than behind the sheet).
    if (bottomSheet && selected) {
      camera.setViewOffset(
        size.width,
        size.height,
        0,
        size.height * 0.22,
        size.width,
        size.height
      )
    } else if (camera.view && camera.view.enabled) {
      camera.clearViewOffset()
    }

    // React to selection changes: fly in to a new body, or fly back home.
    if (selected !== prevSelected.current) {
      const hadSelection = !!prevSelected.current
      prevSelected.current = selected
      framing.current = !!selected
      returning.current = !selected && hadSelection
    }

    // Nothing selected: ease back to the overview, then hand control back.
    if (!selected) {
      if (returning.current) {
        camera.position.lerp(HOME_POS, 0.06)
        controls.target.lerp(ORIGIN, 0.08)
        if (
          camera.position.distanceTo(HOME_POS) < 0.6 &&
          controls.target.length() < 0.3
        ) {
          returning.current = false
        }
        controls.update()
      }
      return
    }

    const obj = registry.current.get(selected)
    if (!obj) return
    obj.getWorldPosition(worldPos)

    if (framing.current) {
      const size = SIZES[selected] || 1
      // Pull the camera back on phones & tablets so planets don't fill the view.
      const small = window.innerWidth <= 1024
      const dist = Math.max(size * (small ? 8 : 4.5), size + (small ? 4 : 2.5))

      // Keep the current viewing angle, just push to a nice framing distance.
      dir.copy(camera.position).sub(controls.target)
      if (dir.lengthSq() < 1e-6) dir.set(0, 0.4, 1)
      dir.normalize()
      desired.copy(worldPos).addScaledVector(dir, dist)

      camera.position.lerp(desired, 0.08)
      controls.target.lerp(worldPos, 0.12)

      // Transition done — hand control back, but keep following below.
      if (
        camera.position.distanceTo(desired) < size * 0.3 + 0.4 &&
        controls.target.distanceTo(worldPos) < 0.25
      ) {
        framing.current = false
      }
    } else {
      // Follow: translate the camera by however far the planet moved this frame
      // so it stays centered while preserving the user's angle and zoom.
      worldPos.sub(controls.target) // worldPos now holds the delta
      camera.position.add(worldPos)
      controls.target.add(worldPos)
    }

    controls.update()
  })

  return null
}

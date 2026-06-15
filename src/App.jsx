import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SolarSystem from './components/SolarSystem'
import InfoPanel from './components/InfoPanel'
import SearchBox from './components/SearchBox'
import { SUN, PLANETS, MOON } from './data/planets'
import './App.css'

// Insert the Moon right after Earth so it reads in natural order in the list.
const BODIES = PLANETS.reduce(
  (acc, planet) => {
    acc.push(planet)
    if (planet.name === 'Earth') acc.push(MOON)
    return acc
  },
  [SUN],
)

export default function App() {
  const [selected, setSelected] = useState(null)
  const [paused, setPaused] = useState(false)

  // Freeze all motion while a body is selected so it's easy to inspect.
  const frozen = paused || selected !== null

  return (
    <div className="app">
      <Canvas
        camera={{ position: [0, 44, 88], fov: 50 }}
        onPointerMissed={() => setSelected(null)}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#05060f']} />
        <Suspense fallback={null}>
          <SolarSystem selected={selected} paused={frozen} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      {/* Title + intro + search */}
      <header className="overlay top-left">
        <h1>The Solar System</h1>
        <p>Drag to orbit · scroll to zoom · click a planet to learn more</p>
        <SearchBox bodies={BODIES} selected={selected} onSelect={setSelected} />
      </header>

      {/* Playback control */}
      <div className="overlay top-right">
        <button className="ctrl-btn" onClick={() => setPaused((p) => !p)}>
          {paused ? '▶ Resume orbits' : '⏸ Pause orbits'}
        </button>
      </div>

      {selected && <InfoPanel name={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

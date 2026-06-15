import { useRef, useState } from 'react'
import { SUN, PLANETS, MOON } from '../data/planets'

const ALL = [SUN, ...PLANETS, MOON]

// The eight principal lunar phases, given as a fraction of the cycle
// (0 = new, 0.5 = full). Lit side is on the right while waxing.
const PHASES = [
  ['New Moon', 0],
  ['Waxing Crescent', 0.125],
  ['First Quarter', 0.25],
  ['Waxing Gibbous', 0.375],
  ['Full Moon', 0.5],
  ['Waning Gibbous', 0.625],
  ['Last Quarter', 0.75],
  ['Waning Crescent', 0.875],
]

const R = 26 // disk radius in SVG units

// SVG path of the sunlit region of the disk for a given phase fraction.
// The terminator is a half-ellipse whose width tracks cos(phase angle).
function litPath(p) {
  const m = R * Math.cos(2 * Math.PI * p) // signed terminator half-width
  const rx = Math.abs(m).toFixed(2)
  if (p <= 0.5) {
    // Waxing — bright limb on the right.
    const term = m > 0 ? 0 : 1
    return `M0,${-R} A${R},${R} 0 0 1 0,${R} A${rx},${R} 0 0 ${term} 0,${-R} Z`
  }
  // Waning — bright limb on the left.
  const term = m > 0 ? 1 : 0
  return `M0,${-R} A${R},${R} 0 0 0 0,${R} A${rx},${R} 0 0 ${term} 0,${-R} Z`
}

function MoonPhases() {
  return (
    <div className="moon-phases">
      {PHASES.map(([label, p], i) => (
        <figure className="moon-phase" key={label}>
          <svg viewBox="-30 -30 60 60" aria-hidden="true">
            <defs>
              <clipPath id={`disk-${i}`}>
                <circle cx="0" cy="0" r={R} />
              </clipPath>
              <clipPath id={`lit-${i}`}>
                <path d={litPath(p)} />
              </clipPath>
            </defs>
            <g clipPath={`url(#disk-${i})`}>
              {/* Dimmed full disk = the shadowed side */}
              <image
                href={MOON.texture}
                x={-R}
                y={-R}
                width={2 * R}
                height={2 * R}
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x={-R}
                y={-R}
                width={2 * R}
                height={2 * R}
                fill="#05060f"
                opacity="0.82"
              />
              {/* Bright sunlit portion clipped to the phase */}
              <g clipPath={`url(#lit-${i})`}>
                <image
                  href={MOON.texture}
                  x={-R}
                  y={-R}
                  width={2 * R}
                  height={2 * R}
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
            </g>
            <circle
              cx="0"
              cy="0"
              r={R}
              fill="none"
              stroke="rgba(150,165,230,0.25)"
              strokeWidth="1"
            />
          </svg>
          <figcaption>{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function InfoPanel({ name, onClose }) {
  const body = ALL.find((b) => b.name === name)
  const [dragY, setDragY] = useState(0)
  const startY = useRef(null)

  if (!body) return null

  // Drag the bottom-sheet handle down to dismiss (mobile).
  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY
  }
  const onTouchMove = (e) => {
    if (startY.current == null) return
    setDragY(Math.max(0, e.touches[0].clientY - startY.current))
  }
  const onTouchEnd = () => {
    if (dragY > 90) onClose()
    else setDragY(0)
    startY.current = null
  }

  return (
    <aside
      className="info-panel"
      key={body.name}
      style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
    >
      {/* Tap or drag down to close (visible on mobile only) */}
      <button
        className="sheet-handle"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-label="Close"
      />

      <button className="close-btn" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div className="info-header">
        <span
          className={`info-thumb${body.rings ? ' has-rings' : ''}`}
          style={{
            // Layer clouds over the daymap for Earth (white-on-black cloud map
            // blended with `screen` so only the clouds show).
            backgroundImage: body.clouds
              ? `url(${body.clouds}), url(${body.texture})`
              : `url(${body.texture})`,
            backgroundBlendMode: body.clouds ? 'screen' : undefined,
            '--glow': body.color,
          }}
          aria-hidden="true"
        />
        <h2>{body.name}</h2>
      </div>

      <p className="info-desc">{body.description}</p>

      <dl className="info-facts">
        {Object.entries(body.facts).map(([label, value]) => (
          <div className="fact-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {body.name === 'Moon' && (
        <section className="moon-section">
          <h3 className="info-subhead">Phases of the Moon</h3>
          <p className="moon-intro">
            As the Moon orbits Earth, the sunlit part we can see grows and shrinks
            over a 29.5-day cycle — from a dark New Moon to a bright Full Moon and
            back again.
          </p>
          <MoonPhases />
        </section>
      )}
    </aside>
  )
}

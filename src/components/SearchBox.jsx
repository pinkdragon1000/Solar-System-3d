import { useState, useMemo, useRef } from 'react'

// Type-ahead search that selects (and zooms to) a body.
export default function SearchBox({ bodies, selected, onSelect }) {
  // `query` only holds text the user is actively typing. When they aren't
  // searching, the input simply shows the current selection (derived below),
  // so picking a body — here or by clicking it in the 3D scene — is reflected
  // without mirroring `selected` into state.
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const blurTimer = useRef(null)

  const value = searching ? query : selected ?? ''

  // "Filtering" means the user is actively narrowing the list — searching with
  // non-empty text. An empty query (even mid-search) still shows the full list.
  const q = query.trim().toLowerCase()
  const filtering = searching && q !== ''

  const matches = useMemo(
    () =>
      filtering ? bodies.filter((b) => b.name.toLowerCase().includes(q)) : bodies,
    [filtering, q, bodies]
  )

  const choose = (name) => {
    onSelect(name)
    setSearching(false)
    setOpen(false)
  }

  const stopSearching = () => {
    setSearching(false)
    setQuery('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && filtering && matches[0]) choose(matches[0].name)
    if (e.key === 'Escape') {
      stopSearching()
      setOpen(false)
      e.currentTarget.blur()
    }
  }

  return (
    <div className="search">
      <svg
        className="search-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-input"
        type="text"
        value={value}
        placeholder="Search"
        onChange={(e) => {
          setQuery(e.target.value)
          setSearching(true)
          setOpen(true)
        }}
        onFocus={(e) => {
          setOpen(true)
          e.target.select() // highlight the selection so typing replaces it
        }}
        onBlur={() => {
          // Delay so a click on a result still registers, then drop back to
          // showing the current selection.
          blurTimer.current = setTimeout(() => {
            setOpen(false)
            stopSearching()
          }, 150)
        }}
        onKeyDown={onKeyDown}
      />

      {open && matches.length > 0 && (
        <ul className="search-results">
          {matches.map((b) => (
            <li
              key={b.name}
              // Only indent the Moon under Earth in the full list; when
              // searching, the filtered results aren't a parent/child tree.
              className={b.name === 'Moon' && !filtering ? 'is-child' : undefined}
            >
              <button
                type="button"
                onMouseDown={() => clearTimeout(blurTimer.current)}
                onClick={() => choose(b.name)}
              >
                <span
                  className="chip-dot"
                  style={{
                    // Layer clouds over the daymap for Earth. The cloud map is
                    // white-on-black, so `screen` blending drops the black and
                    // keeps the white clouds.
                    backgroundImage: b.clouds
                      ? `url(${b.clouds}), url(${b.texture})`
                      : `url(${b.texture})`,
                    backgroundBlendMode: b.clouds ? 'screen' : undefined,
                  }}
                />
                {b.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Visual scales are compressed for viewability — they are NOT to real scale.
// `size` = render radius, `distance` = orbit radius, `spin` = axis-rotation rate.
// `orbitSpeed` scales with 1/sqrt(real orbital period), anchored on Earth = 0.029.
// This keeps the correct ordering (inner planets faster) and roughly real ratios,
// while compressing the range so the outer planets still visibly move.

export const SUN = {
  name: 'Sun',
  color: '#ffcc33',
  size: 4,
  texture: '/textures/2k_sun.jpg',
  description:
    'The Sun is the star at the heart of our solar system. Its gravity holds everything ' +
    'from the largest planets to tiny debris in orbit. The energy it radiates supports ' +
    'almost all life on Earth.',
  facts: {
    Type: 'G-type main-sequence star',
    Diameter: '1,392,700 km',
    'Surface temp': '5,500 °C',
    'Core temp': '15 million °C',
    Age: '~4.6 billion years',
    Composition: '73% hydrogen, 25% helium',
  },
}

export const MOON = {
  name: 'Moon',
  color: '#cfcfcf',
  texture: '/textures/2k_moon.jpg',
  bumpMap: '/textures/2k_moon.jpg',
  bumpScale: 0.015,
  size: 0.25,
  distance: 1.8, // from Earth
  orbitSpeed: 0.18,
  description:
    "Earth's only natural satellite and the fifth-largest moon in the solar system. " +
    'The Moon is tidally locked, so it always shows us the same face. Its gravity tugs ' +
    "on Earth's oceans to create the tides, and the changing sunlit portion we see from " +
    'Earth gives us the lunar phases.',
  facts: {
    Diameter: '3,475 km',
    'Distance from Earth': '384,400 km',
    'Orbit around Earth': '27.3 days',
    'Phase cycle': '29.5 days (new → full)',
    Tides: 'Caused by its gravity',
    'Surface gravity': '1/6 of Earth',
    Composition: '~43% oxygen, 21% silicon (by mass)',
  },
}

export const PLANETS = [
  {
    name: 'Mercury',
    color: '#9c8b7d',
    texture: '/textures/2k_mercury.jpg',
    tiltDeg: 0.03,
    baseGlow: 0.15,
    size: 0.6,
    distance: 8,
    orbitSpeed: 0.059, // 88-day year (0.24 yr)
    spin: 0.004,
    description:
      'The smallest planet and the closest to the Sun. Mercury has almost no atmosphere, ' +
      'so it swings between scorching days and freezing nights.',
    facts: {
      Diameter: '4,879 km',
      'Distance from Sun': '57.9 million km',
      'Day length': '59 Earth days',
      'Orbit around Sun': '88 Earth days',
      Moons: '0',
      'Avg temp': '167 °C',
      Composition: '~70% metallic core, 30% silicate rock',
    },
  },
  {
    name: 'Venus',
    color: '#e6b873',
    texture: '/textures/2k_venus_surface.jpg',
    tiltDeg: 177.4,
    baseGlow: 0.15,
    size: 0.95,
    distance: 11,
    orbitSpeed: 0.037, // 225-day year (0.62 yr)
    spin: 0.012, // retrograde: combined with the ~177° axial tilt this spins it
    // clockwise-from-above, opposite the other planets (exaggerated to be visible)
    description:
      'Venus is the hottest planet, wrapped in a thick toxic atmosphere that traps heat. ' +
      'It spins backwards compared to most planets.',
    facts: {
      Diameter: '12,104 km',
      'Distance from Sun': '108.2 million km',
      'Day length': '243 Earth days',
      'Orbit around Sun': '225 Earth days',
      Moons: '0',
      'Avg temp': '464 °C',
      Composition: '96.5% carbon dioxide, 3.5% nitrogen (atmosphere)',
    },
  },
  {
    name: 'Earth',
    color: '#4f9fe0',
    texture: '/textures/2k_earth_daymap.jpg',
    normalMap: '/textures/earth_normal_2048.jpg',
    clouds: '/textures/2k_earth_clouds.jpg',
    tiltDeg: 23.44,
    baseGlow: 0.15,
    size: 0.9,
    distance: 14.5,
    orbitSpeed: 0.029, // 1-year reference for all the others
    spin: 0.02,
    description:
      'Our home — the only known world with life. Liquid water covers most of its surface ' +
      'and a protective atmosphere shields it from the Sun.',
    facts: {
      Diameter: '12,742 km',
      'Distance from Sun': '149.6 million km',
      'Day length': '24 hours',
      'Orbit around Sun': '365.25 days',
      Moons: '1',
      'Avg temp': '15 °C',
      Composition: '78% nitrogen, 21% oxygen, 1% other (atmosphere)',
    },
    moon: MOON,
  },
  {
    name: 'Mars',
    color: '#d1603d',
    texture: '/textures/2k_mars.jpg',
    bumpMap: '/textures/2k_mars.jpg',
    bumpScale: 0.02,
    tiltDeg: 25.19,
    baseGlow: 0.15,
    size: 0.55,
    distance: 18,
    orbitSpeed: 0.0212, // 1.88-year orbit
    spin: 0.018,
    description:
      'The Red Planet, named for its rusty iron-rich soil. Mars has the tallest volcano ' +
      'and the deepest canyon in the solar system, and is a prime target for exploration.',
    facts: {
      Diameter: '6,779 km',
      'Distance from Sun': '227.9 million km',
      'Day length': '24.6 hours',
      'Orbit around Sun': '687 Earth days',
      Moons: '2',
      'Avg temp': '-65 °C',
      Composition: '95% carbon dioxide, 3% nitrogen, 2% argon (atmosphere)',
    },
  },
  {
    name: 'Jupiter',
    color: '#c9a06a',
    texture: '/textures/2k_jupiter.jpg',
    tiltDeg: 3.13,
    baseGlow: 0.15,
    size: 2.4,
    distance: 25,
    orbitSpeed: 0.0084, // 11.9-year orbit
    spin: 0.04,
    description:
      'The largest planet — a giant ball of gas more than twice as massive as all the ' +
      'other planets combined. Its Great Red Spot is a storm bigger than Earth.',
    facts: {
      Diameter: '139,820 km',
      'Distance from Sun': '778.5 million km',
      'Day length': '9.9 hours',
      'Orbit around Sun': '11.9 Earth years',
      Moons: '95+',
      'Avg temp': '-110 °C',
      Composition: '90% hydrogen, 10% helium',
    },
    bands: true,
  },
  {
    name: 'Saturn',
    color: '#e0c89a',
    texture: '/textures/2k_saturn.jpg',
    tiltDeg: 26.73,
    baseGlow: 0.15,
    size: 2.0,
    distance: 32,
    orbitSpeed: 0.00534, // 29.5-year orbit
    spin: 0.038,
    description:
      'Famous for its stunning ring system made of ice and rock. Saturn is the least ' +
      'dense planet — it would float in water if you could find a big enough ocean.',
    facts: {
      Diameter: '116,460 km',
      'Distance from Sun': '1.43 billion km',
      'Day length': '10.7 hours',
      'Orbit around Sun': '29.5 Earth years',
      Moons: '146+',
      'Avg temp': '-140 °C',
      Composition: '96% hydrogen, 3% helium',
    },
    rings: {
      inner: 1.3,
      outer: 2.3,
      color: '#d8c9a3',
      texture: '/textures/2k_saturn_ring_alpha.png',
    },
  },
  {
    name: 'Uranus',
    color: '#9fe3e0',
    texture: '/textures/2k_uranus.jpg',
    tiltDeg: 97.8,
    baseGlow: 0.15,
    size: 1.4,
    distance: 38,
    orbitSpeed: 0.00316, // 84-year orbit
    spin: 0.03,
    description:
      'An ice giant that rotates on its side, likely knocked over by an ancient collision. ' +
      'Its blue-green colour comes from methane in the atmosphere.',
    facts: {
      Diameter: '50,724 km',
      'Distance from Sun': '2.87 billion km',
      'Day length': '17 hours',
      'Orbit around Sun': '84 Earth years',
      Moons: '28',
      'Avg temp': '-195 °C',
      Composition: '83% hydrogen, 15% helium, 2% methane',
    },
    rings: { inner: 1.7, outer: 2.1, color: '#8fd6d3' },
  },
  {
    name: 'Neptune',
    color: '#3f63d6',
    texture: '/textures/2k_neptune.jpg',
    tiltDeg: 28.32,
    baseGlow: 0.15,
    size: 1.35,
    distance: 43,
    orbitSpeed: 0.00226, // 165-year orbit
    spin: 0.032,
    description:
      'The most distant planet, a cold and windy ice giant. Neptune has the fastest winds ' +
      'in the solar system, reaching over 2,000 km/h.',
    facts: {
      Diameter: '49,244 km',
      'Distance from Sun': '4.5 billion km',
      'Day length': '16 hours',
      'Orbit around Sun': '165 Earth years',
      Moons: '16',
      'Avg temp': '-200 °C',
      Composition: '80% hydrogen, 19% helium, 1.5% methane',
    },
  },
]

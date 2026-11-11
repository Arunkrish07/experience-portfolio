// =============================================================
//  ROBOT MODEL  — 3D humanoid robot (React Three Fiber)
//  Styled after the reference photo: rounded white helmet head,
//  orange visor rim, big yellow camera-eye, segmented white body
//  with black servo joints, articulated arms + legs, orange feet.
//
//  Props:
//    reaction : 'walk' | 'dance' | 'angry' | 'laugh' | 'fall' | null
//    speaking : boolean  (head nod + eye pulse while the bot talks)
// =============================================================
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

const COL = {
  white: '#f1f0ec',
  whiteDark: '#dcdbd5',
  orange: '#ff7a1a',
  orangeDark: '#e85f0c',
  yellow: '#ffc21a',
  black: '#1d1d1f',
  joint: '#2a2a2d',
  lens: '#0a0a0c',
}

// reaction durations (seconds) — kept close to the CSS timings used before
const DUR = { walk: 1.6, dance: 1.4, angry: 1.1, laugh: 1.2, fall: 1.6 }

function Plastic({ color, metalness = 0.12, roughness = 0.5, ...p }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} {...p} />
}

export default function RobotModel({ reaction = null, speaking = false }) {
  const root = useRef()
  const head = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const eyeL = useRef()
  const eyeR = useRef()
  const anim = useRef({ name: null, start: 0 })

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!root.current) return

    // detect a new reaction and stamp its start time
    if (reaction !== anim.current.name) anim.current = { name: reaction, start: t }
    const name = anim.current.name
    const p = t - anim.current.start
    const active = name && p < (DUR[name] || 0)

    // ---- reset to neutral each frame, then layer motion on top ----
    let rx = 0, ry = 0, rz = 0, px = 0, py = 0 // root transform
    let hNod = 0.16, hTilt = 0 // head (slight forward lean by default)
    let lLeg = 0, rLeg = 0, lArm = 0, rArm = 0 // limbs (x swing)
    let lArmZ = 0, rArmZ = 0

    // idle breathing bob (always present, fades under big reactions)
    py += Math.sin(t * 2) * 0.03
    hNod += Math.sin(t * 1.5) * 0.04

    if (active && name === 'walk') {
      const s = Math.sin(p * 10)
      lLeg = s * 0.55; rLeg = -s * 0.55
      lArm = -s * 0.5; rArm = s * 0.5
      px = Math.sin(p * 3) * 0.14
      py += Math.abs(Math.sin(p * 10)) * 0.03
      hTilt = Math.sin(p * 3) * 0.05
    } else if (active && name === 'dance') {
      rz = Math.sin(p * 8) * 0.22
      py += Math.abs(Math.sin(p * 8)) * 0.05
      lArmZ = 0.5 + Math.sin(p * 8) * 0.7
      rArmZ = -0.5 - Math.sin(p * 8) * 0.7
      hTilt = Math.sin(p * 8) * 0.18
    } else if (active && name === 'angry') {
      rz = Math.sin(p * 42) * 0.07
      px = Math.sin(p * 42) * 0.03
      hNod = -0.05
      lArmZ = 0.35; rArmZ = -0.35
    } else if (active && name === 'laugh') {
      py += Math.abs(Math.sin(p * 11)) * 0.06
      hNod = 0.28 + Math.sin(p * 11) * 0.12
      rz = Math.sin(p * 5) * 0.06
      lArm = -0.3; rArm = -0.3
    } else if (active && name === 'fall') {
      let fx
      if (p < 0.45) fx = (p / 0.45) * 1.4
      else if (p < 1.0) fx = 1.4
      else fx = Math.max(0, 1.4 * (1 - (p - 1.0) / 0.6))
      rx = fx
      py += -fx * 0.12
      hNod = 0.16 + fx * 0.2
    }

    // speaking → quick head nod on top of whatever else is happening
    if (speaking) hNod += Math.sin(t * 13) * 0.09

    root.current.rotation.set(rx, ry, rz)
    root.current.position.set(px, py, 0)
    if (head.current) head.current.rotation.set(hNod, hTilt, 0)
    if (legL.current) legL.current.rotation.x = lLeg
    if (legR.current) legR.current.rotation.x = rLeg
    if (armL.current) armL.current.rotation.set(lArm, 0, lArmZ)
    if (armR.current) armR.current.rotation.set(rArm, 0, rArmZ)

    // eye glow: red when angry, soft pulse when speaking, else steady
    const angry = active && name === 'angry'
    const pulse = speaking ? 0.5 + Math.abs(Math.sin(t * 10)) * 0.9 : 0.55
    ;[eyeL, eyeR].forEach((e) => {
      // refs are on the <meshStandardMaterial> itself, so e.current IS the material
      if (!e.current) return
      e.current.color.set(angry ? '#ff3b30' : COL.yellow)
      e.current.emissive.set(angry ? '#ff3b30' : COL.yellow)
      e.current.emissiveIntensity = angry ? 1.1 : pulse
    })
  })

  return (
    <group ref={root} position={[0, -0.1, 0]}>
      {/* ---------------- LEGS (pivot at hips) ---------------- */}
      {[-1, 1].map((side) => (
        <group key={side} ref={side === -1 ? legL : legR} position={[0.17 * side, -0.15, 0]}>
          {/* hip servo */}
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.26, 0.2, 0.26]} /><Plastic color={COL.black} metalness={0.3} roughness={0.4} /></mesh>
          {/* thigh */}
          <RoundedBox args={[0.22, 0.34, 0.24]} radius={0.05} smoothness={3} position={[0, -0.28, 0]}><Plastic color={COL.white} /></RoundedBox>
          {/* knee servo */}
          <mesh position={[0, -0.5, 0]}><boxGeometry args={[0.24, 0.16, 0.24]} /><Plastic color={COL.black} metalness={0.3} roughness={0.4} /></mesh>
          {/* shin */}
          <RoundedBox args={[0.2, 0.22, 0.22]} radius={0.04} smoothness={3} position={[0, -0.68, 0]}><Plastic color={COL.white} /></RoundedBox>
          {/* orange foot (extends forward) */}
          <RoundedBox args={[0.3, 0.1, 0.42]} radius={0.04} smoothness={3} position={[0, -0.82, 0.08]}><Plastic color={COL.orange} roughness={0.45} /></RoundedBox>
        </group>
      ))}

      {/* ---------------- TORSO ---------------- */}
      {/* hip block */}
      <RoundedBox args={[0.5, 0.26, 0.34]} radius={0.06} smoothness={4} position={[0, 0.06, 0]}><Plastic color={COL.white} /></RoundedBox>
      {/* waist joint */}
      <mesh position={[0, 0.26, 0]}><boxGeometry args={[0.3, 0.14, 0.3]} /><Plastic color={COL.joint} metalness={0.3} roughness={0.4} /></mesh>
      {/* chest */}
      <RoundedBox args={[0.56, 0.44, 0.4]} radius={0.09} smoothness={4} position={[0, 0.56, 0]}><Plastic color={COL.white} /></RoundedBox>
      {/* chest detail strip */}
      <mesh position={[0, 0.5, 0.205]}><boxGeometry args={[0.34, 0.16, 0.02]} /><Plastic color={COL.joint} metalness={0.4} roughness={0.5} /></mesh>

      {/* ---------------- ARMS (pivot at shoulders) ---------------- */}
      {[-1, 1].map((side) => (
        <group key={side} ref={side === -1 ? armL : armR} position={[0.36 * side, 0.74, 0]} rotation={[0.1, 0, 0.12 * side]}>
          {/* shoulder servo */}
          <mesh><boxGeometry args={[0.18, 0.2, 0.2]} /><Plastic color={COL.black} metalness={0.3} roughness={0.4} /></mesh>
          {/* upper arm */}
          <RoundedBox args={[0.15, 0.3, 0.16]} radius={0.04} smoothness={3} position={[0, -0.26, 0]}><Plastic color={COL.white} /></RoundedBox>
          {/* hand */}
          <RoundedBox args={[0.14, 0.16, 0.15]} radius={0.04} smoothness={3} position={[0, -0.46, 0]}><Plastic color={COL.orange} roughness={0.45} /></RoundedBox>
        </group>
      ))}

      {/* ---------------- NECK + HEAD (pivot at neck top) ---------------- */}
      <group ref={head} position={[0, 0.82, 0]}>
        {/* neck servos */}
        <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.16, 0.12, 0.16]} /><Plastic color={COL.joint} metalness={0.3} roughness={0.4} /></mesh>

        {/* head shell — rounded helmet, slightly domed */}
        <RoundedBox args={[0.78, 0.6, 0.64]} radius={0.22} smoothness={6} position={[0, 0.38, 0]}>
          <Plastic color={COL.white} roughness={0.42} />
        </RoundedBox>
        {/* subtle top dome highlight piece */}
        <RoundedBox args={[0.5, 0.2, 0.5]} radius={0.16} smoothness={5} position={[0, 0.58, 0]}>
          <Plastic color={COL.whiteDark} roughness={0.42} />
        </RoundedBox>

        {/* orange visor rim across the lower front of the face */}
        <RoundedBox args={[0.8, 0.16, 0.12]} radius={0.05} smoothness={4} position={[0, 0.2, 0.29]} rotation={[0.18, 0, 0]}>
          <Plastic color={COL.orange} roughness={0.4} />
        </RoundedBox>
        {/* orange side cheek guards */}
        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.1, 0.34, 0.5]} radius={0.05} smoothness={4} position={[0.37 * s, 0.34, 0.02]}>
            <Plastic color={COL.orange} roughness={0.4} />
          </RoundedBox>
        ))}

        {/* big yellow camera eye */}
        <mesh position={[0, 0.36, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
          <meshStandardMaterial ref={eyeL} color={COL.yellow} emissive={COL.yellow} emissiveIntensity={0.55} roughness={0.3} />
        </mesh>
        {/* black lens */}
        <mesh position={[0, 0.36, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 32]} />
          <meshStandardMaterial color={COL.lens} roughness={0.15} metalness={0.3} />
        </mesh>
        {/* lens catch-light */}
        <mesh position={[0.03, 0.4, 0.38]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* small side sensor (second "eye" hint, like the photo) */}
        <mesh position={[0.26, 0.34, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 20]} />
          <meshStandardMaterial ref={eyeR} color={COL.yellow} emissive={COL.yellow} emissiveIntensity={0.55} roughness={0.3} />
        </mesh>

        {/* little colored sticker on the helmet (like the photo) */}
        <mesh position={[0.22, 0.5, 0.24]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.1, 0.07, 0.01]} />
          <meshStandardMaterial color="#ff4d4d" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

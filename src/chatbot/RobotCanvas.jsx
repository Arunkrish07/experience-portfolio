// =============================================================
//  ROBOT CANVAS  — mounts the 3D robot in a small transparent
//  WebGL canvas. Lazy-loaded so Three.js isn't in the initial
//  page load; the SVG duck is shown until this is ready.
// =============================================================
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import RobotModel from './RobotModel'

export default function RobotCanvas({ reaction = null, speaking = false }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      // Camera sits on the Z axis looking straight at the origin, so the
      // robot (centred below) stays framed.
      camera={{ position: [0, 0, 5], fov: 34 }}
      frameloop="always"
    >
      {/* lighting — soft studio feel for the white/orange plastic */}
      <hemisphereLight args={['#ffffff', '#b9b7ae', 0.75]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#cfd4ff" />
      <pointLight position={[0, 1.5, 2.5]} intensity={0.6} />

      {/* centre the robot at the origin and give a slight 3/4 turn for depth */}
      <group position={[0, -0.17, 0]} rotation={[0, -0.2, 0]}>
        <RobotModel reaction={reaction} speaking={speaking} />
        <ContactShadows
          position={[0, -1.14, 0]}
          opacity={0.4}
          scale={3.2}
          blur={2.6}
          far={2.2}
          resolution={256}
          color="#2a2a2d"
        />
      </group>
    </Canvas>
  )
}

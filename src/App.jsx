import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  MeshDistortMaterial,
  Float,
} from "@react-three/drei";
import {
  ExternalLink,
  Globe,
  Bot,
  Zap,
  Server,
  Share2,
  Disc,
} from "lucide-react";

const DISCORD_ID = "900965149496737874";

// --- RUBIK'S CUBE COMPONENT ---
function RubiksCube() {
  const meshRef = useRef();

  // Slow constant rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Creating a 3x3 grid of smaller cubes
  const cubes = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubes.push([x * 1.05, y * 1.05, z * 1.05]);
      }
    }
  }

  return (
    <group ref={meshRef}>
      {cubes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          {/* iOS-style Glass Material for the Cube pieces */}
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.6}
            thickness={0.5}
            roughness={0.1}
            envMapIntensity={2}
            clearcoat={1}
          />
        </mesh>
      ))}
    </group>
  );
}

const projects = [
  {
    name: "Discord Automation",
    desc: "Advanced bot architectures and API integration.",
    icon: <Bot size={20} />,
  },
  {
    name: "Roblox Mechanics",
    desc: "Optimized movement physics and player-controller scripts.",
    icon: <Zap size={20} />,
  },
  {
    name: "Server Architecture",
    desc: "Minecraft environment deployment and backend optimization.",
    icon: <Server size={20} />,
  },
  {
    name: "Cross-Platform Sync",
    desc: "Minecraft-to-Discord relay bridges and live data fetching.",
    icon: <Share2 size={16} />,
  },
];

export default function App() {
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const cardRef = useRef(null);

  const cursorX = useSpring(0, { stiffness: 600, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 25 });
  const cardX = useSpring(0, { stiffness: 80, damping: 40 });
  const cardY = useSpring(0, { stiffness: 80, damping: 40 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], [-15, 15]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [15, -15]);
  const bgTextX = useTransform(cursorX, [0, 2000], [20, -20]);
  const bgTextY = useTransform(cursorY, [0, 2000], [20, -20]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
        );
        const json = await res.json();
        if (json.success) setLanyard(json.data);
      } catch (err) {
        console.error("Lanyard Failed:", err);
      }
    };
    fetchData();
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    const handleGlobalMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        cardX.set(relX);
        cardY.set(relY);
      }
    };
    window.addEventListener("mousemove", handleGlobalMouse);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouse);
      clearInterval(t);
    };
  }, []);

  if (!lanyard) return <div className="min-h-screen bg-[#08080c]" />;

  const status = lanyard.discord_status;
  const statusColors = {
    online: "#22c55e",
    dnd: "#ef4444",
    idle: "#f59e0b",
    offline: "#64748b",
  };
  const activeStatusColor = statusColors[status] || statusColors.offline;

  return (
    <div className="relative min-h-screen bg-[#08080c] overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.2] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeStatusColor,
        }}
      />

      {/* Parallax Background Text */}
      <motion.div
        style={{
          x: bgTextX,
          y: bgTextY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-1/2 left-1/2 z-0 pointer-events-none"
      >
        <h1
          className="font-black text-zinc-900/50 select-none"
          style={{ fontSize: "25vw" }}
        >
          ZXRQI
        </h1>
      </motion.div>

      {/* Solid Inverting Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] bg-red-600 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 gap-12 z-10 relative">
        {/* LEFT: Profile Card */}
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full max-w-[360px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="relative mb-6">
            <img
              src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
              className="w-24 h-24 rounded-full border-2 border-white/10 mx-auto"
            />
            <div
              className="absolute bottom-1 right-[38%] w-5 h-5 rounded-full border-4 border-[#08080c]"
              style={{ backgroundColor: activeStatusColor }}
            />
          </div>
          <h1 className="text-3xl font-black text-center uppercase tracking-tighter">
            {lanyard.discord_user.global_name}
          </h1>
          <p
            className="text-center font-mono text-[10px] tracking-widest mt-2 uppercase"
            style={{ color: activeStatusColor }}
          >
            System {status}
          </p>
          <div className="mt-8 space-y-3">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
              <p className="opacity-30 uppercase font-black mb-1">Activity</p>
              <p>
                {lanyard.activities?.find((a) => a.type === 4)?.state || "Idle"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CENTER: Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {projects.map((p, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/[0.05] transition-all"
            >
              <div style={{ color: activeStatusColor }} className="mb-3">
                {p.icon}
              </div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-[10px] opacity-40 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* RIGHT (OPTION B): Interactive 3D Cube */}
        <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] relative cursor-grab active:cursor-grabbing">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
              <RubiksCube />
            </Float>

            <OrbitControls enableZoom={false} makeDefault />
          </Canvas>
          <p className="absolute bottom-0 w-full text-center text-[9px] font-mono opacity-20 uppercase tracking-[0.3em] pointer-events-none">
            Interact to Rotate
          </p>
        </div>
      </div>
    </div>
  );
}

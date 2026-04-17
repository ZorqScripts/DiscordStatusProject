import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
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

  // High-performance springs
  const cursorX = useSpring(0, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 30 });
  const cardX = useSpring(0, { stiffness: 100, damping: 30 });
  const cardY = useSpring(0, { stiffness: 100, damping: 30 });

  // Rotation for 3D effect
  const rotateX = useTransform(cardY, [-0.5, 0.5], [-20, 20]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [20, -20]);

  // Background parallax
  const bgTextX = useTransform(cursorX, [0, 1920], [30, -30]);
  const bgTextY = useTransform(cursorY, [0, 1080], [30, -30]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
        );
        const json = await res.json();
        if (json.success) setLanyard(json.data);
      } catch (err) {
        console.error("Lanyard Failed");
      }
    };
    fetchData();
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    const handleMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        cardX.set((e.clientX - rect.left) / rect.width - 0.5);
        cardY.set((e.clientY - rect.top) / rect.height - 0.5);
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      clearInterval(t);
    };
  }, []);

  if (!lanyard) return <div className="min-h-screen bg-[#050505]" />;

  const status = lanyard.discord_status;
  const statusColors = {
    online: "#22c55e",
    dnd: "#ef4444",
    idle: "#f59e0b",
    offline: "#64748b",
  };
  const activeColor = statusColors[status] || statusColors.offline;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white/10 overflow-hidden font-sans">
      {/* 1. DYNAMIC BACKGROUND GLOW */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.15] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />

      {/* 2. FLOATING GLASS SHARDS (The 3D catchiness) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl pointer-events-none"
          style={{
            width: 100 + i * 20,
            height: 100 + i * 20,
            top: `${20 * i}%`,
            left: `${15 * i}%`,
            opacity: 0.1,
            zIndex: 1,
          }}
        />
      ))}

      {/* 3. PARALLAX OUTLINE TEXT */}
      <motion.div
        style={{
          x: bgTextX,
          y: bgTextY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-1/2 left-1/2 z-0 opacity-20 pointer-events-none"
      >
        <h1
          className="font-black tracking-tighter select-none uppercase text-transparent"
          style={{
            fontSize: "20vw",
            WebkitTextStroke: "2px rgba(255,255,255,0.2)",
          }}
        >
          ZXRQI
        </h1>
      </motion.div>

      {/* 4. SOLID INVERTING CURSOR */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] bg-red-600 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center p-6 gap-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
          {/* THE 3D CARD */}
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-[380px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group"
          >
            {/* Inner Glare Effect */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div
              style={{ transform: "translateZ(100px)" }}
              className="relative mb-8"
            >
              <img
                src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                className="w-28 h-28 rounded-full border-2 border-white/10 mx-auto shadow-2xl"
              />
              <div
                className="absolute bottom-2 right-[35%] w-6 h-6 rounded-full border-4 border-[#050505] shadow-lg"
                style={{ backgroundColor: activeColor }}
              />
            </div>

            <div style={{ transform: "translateZ(60px)" }}>
              <h1 className="text-4xl font-black text-center uppercase tracking-tighter italic leading-none">
                {lanyard.discord_user.global_name}
              </h1>
              <p
                className="text-center font-mono text-[10px] tracking-[0.5em] mt-3 uppercase font-bold"
                style={{ color: activeColor }}
              >
                {status} Secure_Node
              </p>
            </div>

            <div
              style={{ transform: "translateZ(40px)" }}
              className="mt-10 space-y-4"
            >
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase opacity-30">
                  Status
                </span>
                <span className="text-xs font-medium">
                  {lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Scanning..."}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase opacity-30">
                  Local Time
                </span>
                <span className="text-xs font-mono">{time}</span>
              </div>
            </div>

            <button
              style={{
                transform: "translateZ(80px)",
                backgroundColor: activeColor,
              }}
              className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-125 transition-all active:scale-95"
            >
              Contact Profile
            </button>
          </motion.div>

          {/* PROJECT TILES */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {projects.map((p, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/[0.06] transition-all group shadow-xl"
              >
                <div
                  style={{ color: activeColor }}
                  className="mb-4 transition-transform group-hover:scale-110"
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
            {/* Spotify-style Live Card */}
            <div className="md:col-span-2 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center animate-pulse">
                  <Disc size={20} style={{ color: activeColor }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">
                    Signal Source
                  </p>
                  <p className="text-sm font-medium">
                    {lanyard.spotify
                      ? lanyard.spotify.song
                      : "Ambient System Noise"}
                  </p>
                </div>
              </div>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

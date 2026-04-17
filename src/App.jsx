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
  Music,
  Shield,
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
  {
    name: "Web Infrastructure",
    desc: "High-availability web hosting and frontend deployment.",
    icon: <Globe size={20} />,
  },
];

export default function App() {
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const cardRef = useRef(null);

  const cursorX = useSpring(0, { stiffness: 600, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 25 });
  const cardX = useSpring(0, { stiffness: 100, damping: 30 });
  const cardY = useSpring(0, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], [-10, 10]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [10, -10]);
  const bgTextX = useTransform(cursorX, [0, 2000], [20, -20]);
  const bgTextY = useTransform(cursorY, [0, 1000], [20, -20]);

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
    const dInt = setInterval(fetchData, 30000);
    const tInt = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    const handleMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const isNear =
          e.clientX >= rect.left - 100 &&
          e.clientX <= rect.right + 100 &&
          e.clientY >= rect.top - 100 &&
          e.clientY <= rect.bottom + 100;
        if (isNear) {
          cardX.set((e.clientX - rect.left) / rect.width - 0.5);
          cardY.set((e.clientY - rect.top) / rect.height - 0.5);
        } else {
          cardX.set(0);
          cardY.set(0);
        }
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      clearInterval(dInt);
      clearInterval(tInt);
      window.removeEventListener("mousemove", handleMouse);
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
  const activeColor = statusColors[status] || statusColors.offline;
  const isPlaying = !!lanyard.spotify;

  return (
    <div className="relative min-h-screen bg-[#08080c] overflow-hidden text-white font-sans selection:bg-white/10">
      {/* Background Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.15] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />

      {/* Massive ZORQ Text */}
      <motion.div
        style={{
          x: bgTextX,
          y: bgTextY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-1/2 left-1/2 z-[1] pointer-events-none"
      >
        <h1
          className="font-black text-zinc-900 leading-none select-none"
          style={{ fontSize: "25vw" }}
        >
          ZORQ
        </h1>
      </motion.div>

      {/* Dynamic Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />

      <div className="min-h-screen flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Main Profile Card (From Screenshot) */}
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="lg:col-span-4 bg-[#0f0f11] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center"
          >
            <div
              className="relative mb-8"
              style={{ transform: "translateZ(50px)" }}
            >
              <img
                src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                className="w-28 h-28 rounded-full border-4 border-zinc-800 object-cover"
              />
              <div
                className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-[#0f0f11]"
                style={{ backgroundColor: activeColor }}
              />
            </div>

            <h1 className="text-4xl font-black tracking-tighter mb-1">ZORQ</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-green-500/80 mb-10">
              Full-Stack Architect
            </p>

            <div className="w-full space-y-4 mb-10 text-left">
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                <p className="text-[9px] opacity-30 font-black uppercase mb-1">
                  Process
                </p>
                <p className="text-sm font-bold">
                  {lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Zzz"}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl font-mono text-sm">
                <p className="text-[9px] opacity-30 font-black uppercase mb-1 font-sans">
                  Clock
                </p>
                <p className="font-bold opacity-80">{time}</p>
              </div>
            </div>

            <button
              style={{ backgroundColor: activeColor }}
              className="w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-xl transition-all"
            >
              Secure Link <ExternalLink size={14} />
            </button>
          </motion.div>

          {/* RIGHT: The Project & Spotify Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f11] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.02] transition-all group"
                >
                  <div
                    style={{ color: activeColor }}
                    className="mb-4 opacity-80"
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}

              {/* SPOTIFY PLAYER (Replacing Livestream Block) */}
              <div className="md:col-span-2 bg-[#0f0f11] border border-white/5 p-8 rounded-[2rem] flex items-center gap-8 relative overflow-hidden">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full bg-zinc-900 border-[4px] border-zinc-800 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <img
                        src={lanyard.spotify.album_art_url}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <Disc size={20} className="opacity-20" />
                    )}
                  </motion.div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/10"}`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
                      {isPlaying ? "Spotify Player" : "Spotify Offline"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold truncate">
                    {isPlaying
                      ? `Playing: ${lanyard.spotify.song}`
                      : "Awaiting Signal..."}
                  </h3>
                  <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: isPlaying ? "85%" : "0%" }}
                      className="h-full bg-green-500 shadow-[0_0_15px_#22c55e]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0f0f11] border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-[9px] opacity-20 font-black uppercase mb-1">
                  Signal
                </p>
                <p
                  className="text-[11px] font-bold"
                  style={{ color: activeColor }}
                >
                  {status.toUpperCase()}
                </p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-[9px] opacity-20 font-black uppercase mb-1">
                  Node
                </p>
                <p className="text-[11px] font-bold">ASIA_DL</p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-4 rounded-2xl text-center">
                <p className="text-[9px] opacity-20 font-black uppercase mb-1">
                  Relay
                </p>
                <p className="text-[11px] font-bold">0.002MS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

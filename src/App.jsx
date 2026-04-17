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
    name: "Web Infrastructure",
    desc: "High-availability web hosting and frontend deployment.",
    icon: <Globe size={20} />,
  },
  {
    name: "Cross-Platform Sync",
    desc: "Minecraft-to-Discord relay bridges and live data fetching.",
    icon: <Share2 size={16} />,
  },
  {
    name: "Security Protocols",
    desc: "Implementing V3.7_DL data encryption standards.",
    icon: <Shield size={18} />,
  },
];

export default function App() {
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const cardRef = useRef(null);

  // Smooth Springs
  const cursorX = useSpring(0, { stiffness: 600, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 30 });
  const cardX = useSpring(0, { stiffness: 150, damping: 40 });
  const cardY = useSpring(0, { stiffness: 150, damping: 40 });

  // Tilt Transform
  const rotateX = useTransform(cardY, [-0.5, 0.5], [-12, 12]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [12, -12]);

  // Background Parallax
  const bgTextX = useTransform(cursorX, [0, 2000], [30, -30]);
  const bgTextY = useTransform(cursorY, [0, 1000], [30, -30]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
        );
        const json = await res.json();
        if (json.success) setLanyard(json.data);
      } catch (err) {
        console.error("Lanyard Error");
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
        // SENSITIVITY BUFFER: Only tilt if cursor is within 100px of the card
        const buffer = 100;
        const isNear =
          e.clientX >= rect.left - buffer &&
          e.clientX <= rect.right + buffer &&
          e.clientY >= rect.top - buffer &&
          e.clientY <= rect.bottom + buffer;

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
    <div className="relative min-h-screen bg-[#08080c] overflow-hidden">
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

      {/* Parallax ZORQ */}
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
          className="font-sans font-black text-zinc-900 leading-none select-none opacity-80"
          style={{ fontSize: "28vw" }}
        >
          ZORQ
        </h1>
      </motion.div>

      {/* Inverting Cursor */}
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

      <div className="min-h-screen flex items-center justify-center p-6 lg:p-12 z-10 relative">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Card */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[360px] bg-white/[0.03] border border-white/10 backdrop-blur-[30px] p-8 rounded-[2.5rem] text-center shadow-2xl"
            >
              <div
                className="relative inline-block mb-6"
                style={{ transform: "translateZ(50px)" }}
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="w-24 h-24 rounded-full ring-2 ring-white/10 bg-black/20 object-cover"
                />
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[#08080c]"
                  style={{ backgroundColor: activeColor }}
                ></div>
              </div>

              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">
                {lanyard.discord_user.global_name}
              </h1>
              <p
                style={{ color: activeColor }}
                className="font-mono text-[9px] tracking-[0.4em] mb-8 uppercase font-bold"
              >
                {status} Node
              </p>

              <div className="space-y-3 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                  <p className="text-[9px] opacity-30 font-black uppercase mb-1">
                    Process
                  </p>
                  <p className="text-xs truncate">
                    {lanyard.activities?.find((a) => a.type === 4)?.state ||
                      "Scanning..."}
                  </p>
                </div>
              </div>

              <button
                style={{ backgroundColor: activeColor }}
                className="w-full py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl hover:brightness-110 transition-all"
              >
                Contact
              </button>
            </motion.div>
          </div>

          {/* Grid & Spotify */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl backdrop-blur-md hover:bg-white/[0.05] transition-all"
                >
                  <div className="mb-3" style={{ color: activeColor }}>
                    {proj.icon}
                  </div>
                  <h3 className="text-sm font-bold">{proj.name}</h3>
                  <p className="text-[10px] text-white/40 mt-1 leading-tight">
                    {proj.desc}
                  </p>
                </div>
              ))}

              {/* Compact Vinyl Spotify Player */}
              <div className="md:col-span-3 bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 backdrop-blur-2xl flex items-center gap-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full bg-zinc-900 border-[4px] border-zinc-800 shadow-2xl flex items-center justify-center relative overflow-hidden"
                  >
                    {isPlaying ? (
                      <img
                        src={lanyard.spotify.album_art_url}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    )}
                    <div className="absolute inset-0 rounded-full border border-white/5" />
                  </motion.div>
                  {/* Needle moves when playing */}
                  <motion.div
                    animate={{ rotate: isPlaying ? 25 : 0 }}
                    className="absolute top-0 -right-1 w-0.5 h-10 bg-zinc-500 rounded-full origin-top transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/10"}`}
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      {isPlaying ? "Listening to Spotify" : "Spotify Offline"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold truncate leading-tight">
                    {isPlaying ? lanyard.spotify.song : "No signal detected"}
                  </h3>
                  <p className="text-[11px] text-white/40 truncate mb-3">
                    {isPlaying
                      ? `by ${lanyard.spotify.artist}`
                      : "Standing by..."}
                  </p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: isPlaying ? "65%" : "0%" }}
                      className="h-full bg-white/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    desc: "Advanced bot architectures.",
    icon: <Bot size={18} />,
  },
  {
    name: "Roblox Mechanics",
    desc: "Optimized movement physics.",
    icon: <Zap size={18} />,
  },
  {
    name: "Server Architecture",
    desc: "Minecraft environment deployment.",
    icon: <Server size={18} />,
  },
  {
    name: "Web Infrastructure",
    desc: "High-availability web hosting.",
    icon: <Globe size={18} />,
  },
  {
    name: "Cross-Platform Sync",
    desc: "Minecraft-to-Discord relay bridges.",
    icon: <Share2 size={18} />,
  },
  {
    name: "Security Protocols",
    desc: "V3.7_DL encryption standards.",
    icon: <Shield size={18} />,
  },
];

export default function App() {
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const cardRef = useRef(null);

  const cursorX = useSpring(0, { stiffness: 600, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 30 });
  const cardX = useSpring(0, { stiffness: 150, damping: 40 });
  const cardY = useSpring(0, { stiffness: 150, damping: 40 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], [-12, 12]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [12, -12]);
  const bgTextX = useTransform(cursorX, [0, 2000], [25, -25]);
  const bgTextY = useTransform(cursorY, [0, 1000], [25, -25]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
        );
        const json = await res.json();
        if (json.success) setLanyard(json.data);
      } catch (err) {
        console.error("API Error");
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
    <div className="relative min-h-screen bg-[#08080c] overflow-hidden text-white/90 font-sans">
      {/* Background Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.18] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />

      {/* Massive ZORQ Background */}
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
          style={{ fontSize: "28vw" }}
        >
          ZORQ
        </h1>
      </motion.div>

      {/* Dynamic Inverting Cursor */}
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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Profile Card */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[340px] bg-white/[0.03] border border-white/10 backdrop-blur-[30px] p-8 rounded-[2.5rem] text-center shadow-2xl"
            >
              <div className="relative inline-block mb-6">
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="w-24 h-24 rounded-full ring-2 ring-white/10"
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

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left mb-6">
                <p className="text-[9px] opacity-30 font-black uppercase mb-1">
                  Process
                </p>
                <p className="text-xs truncate">
                  {lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Scanning..."}
                </p>
              </div>

              <button
                style={{ backgroundColor: activeColor }}
                className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 shadow-lg"
              >
                Contact Profile
              </button>
            </motion.div>
          </div>

          {/* Projects & Spotify */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 p-5 rounded-[1.8rem] backdrop-blur-md flex items-center gap-4 hover:bg-white/[0.05] transition-all"
                >
                  <div
                    style={{ color: activeColor }}
                    className="p-3 bg-white/5 rounded-2xl"
                  >
                    {proj.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{proj.name}</h3>
                    <p className="text-[10px] text-white/40 leading-tight">
                      {proj.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Compact Spotify Vinyl - Fits into the grid */}
              <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2rem] p-4 backdrop-blur-3xl flex items-center gap-5 shadow-2xl overflow-hidden group">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full bg-zinc-900 border-[3px] border-zinc-800 shadow-xl flex items-center justify-center relative"
                  >
                    {isPlaying ? (
                      <img
                        src={lanyard.spotify.album_art_url}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    )}
                    <div className="absolute inset-0 rounded-full border border-white/5" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: isPlaying ? 25 : 0 }}
                    className="absolute top-0 -right-1 w-0.5 h-8 bg-zinc-500 rounded-full origin-top transition-all"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/10"}`}
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                      {isPlaying ? "Listening on Spotify" : "Spotify Offline"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold truncate leading-tight">
                    {isPlaying ? lanyard.spotify.song : "System Idle"}
                  </h3>
                  <p className="text-[10px] text-white/40 truncate">
                    {isPlaying
                      ? `by ${lanyard.spotify.artist}`
                      : "Awaiting signal input..."}
                  </p>
                  <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: isPlaying ? "75%" : "0%" }}
                      className="h-full bg-white/20"
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

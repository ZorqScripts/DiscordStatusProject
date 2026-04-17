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

  // Smooth Follow Cursor
  const cursorX = useSpring(0, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 30 });

  // Tilt Settings
  const cardX = useSpring(0, { stiffness: 80, damping: 40 });
  const cardY = useSpring(0, { stiffness: 80, damping: 40 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], [-15, 15]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], [15, -15]);

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
    const dataInterval = setInterval(fetchData, 30000);
    const timeInterval = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );

    const handleGlobalMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const buffer = 150;
        const isInside =
          e.clientX >= rect.left - buffer &&
          e.clientX <= rect.right + buffer &&
          e.clientY >= rect.top - buffer &&
          e.clientY <= rect.bottom + buffer;

        if (isInside) {
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          cardX.set(relX);
          cardY.set(relY);
        } else {
          cardX.set(0);
          cardY.set(0);
        }
      }
    };

    window.addEventListener("mousemove", handleGlobalMouse);
    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
      window.removeEventListener("mousemove", handleGlobalMouse);
    };
  }, [cardX, cardY, cursorX, cursorY]);

  if (!lanyard)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white font-mono animate-pulse italic uppercase tracking-widest">
          initializing_system...
        </div>
      </div>
    );

  const status = lanyard.discord_status;
  const accentColor = "#6366f1"; // Indigo accent for that clean iOS look

  return (
    // iOS GLASS BACKGROUND: Deep base with a blurry overlay
    <div className="relative min-h-screen bg-[#0f172a] overflow-hidden selection:bg-indigo-500/30">
      {/* Moving Light Orbs (The stuff behind the glass) */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.2] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: accentColor,
        }}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[150px] rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[150px] rounded-full" />

      {/* CUSTOM CURSOR: Makes mouse visible on any background */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border-2 border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Main Content Container */}
      <div className="min-h-screen text-white/90 font-sans flex items-center justify-center p-4 lg:p-12 z-10 relative">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* iOS GLASS CARD */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[360px] bg-white/10 border border-white/20 backdrop-blur-[25px] p-8 rounded-[2.5rem] text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)]"
            >
              <div
                className="relative inline-block mb-6"
                style={{ transform: "translateZ(60px)" }}
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="relative w-28 h-28 rounded-full ring-2 ring-white/20 bg-black/20 object-cover z-10 shadow-2xl"
                  alt="avatar"
                />
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white/10 z-30 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                ></div>
              </div>

              <h1
                style={{ transform: "translateZ(40px)" }}
                className="text-3xl font-black tracking-tighter uppercase text-white leading-none mb-1"
              >
                {lanyard.discord_user.global_name || "zxrqi"}
              </h1>
              <p
                style={{ transform: "translateZ(30px)" }}
                className="text-indigo-300 font-mono text-[9px] tracking-[0.4em] mb-8 uppercase font-bold"
              >
                Full-Stack Architect
              </p>

              <div
                className="space-y-3 mb-8"
                style={{ transform: "translateZ(20px)" }}
              >
                <ActivityRow
                  label="Status"
                  value={
                    lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Active"
                  }
                />
                <ActivityRow label="System Time" value={time} />
              </div>

              <button
                onClick={() =>
                  window.open(`https://discord.com/users/${DISCORD_ID}`)
                }
                style={{
                  backgroundColor: accentColor,
                  transform: "translateZ(50px)",
                }}
                className="w-full py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Secure Link <ExternalLink size={14} />
              </button>
            </motion.div>
          </div>

          {/* Info Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all shadow-xl"
                >
                  <div className="mb-4 text-indigo-400">{proj.icon}</div>
                  <h3 className="text-lg font-bold mb-1.5">{proj.name}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              ))}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase mb-3 text-indigo-400">
                    <Disc
                      className={lanyard.spotify ? "animate-spin-slow" : ""}
                      size={14}
                    />{" "}
                    {lanyard.spotify ? "Now Playing" : "System Standby"}
                  </div>
                  <p className="text-sm text-white/80 font-medium leading-snug">
                    {lanyard.spotify
                      ? lanyard.spotify.song
                      : "Optimizing background processes..."}
                  </p>
                </div>
                <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["10%", "90%", "10%"] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Signal" value={status.toUpperCase()} />
              <StatBox label="Latency" value="2ms" />
              <StatBox label="Node" value="Main_V1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col text-left">
      <p className="text-[9px] text-white/30 font-black uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium truncate text-white/90">{value}</p>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg">
      <p className="text-[10px] text-white/30 font-black uppercase mb-1">
        {label}
      </p>
      <p className="text-[11px] font-mono font-bold text-white/90">{value}</p>
    </div>
  );
}

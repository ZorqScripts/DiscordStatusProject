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

  const cursorX = useSpring(0, { stiffness: 250, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 250, damping: 25 });

  const glowX = useTransform(cursorX, (val) => val - 20);
  const glowY = useTransform(cursorY, (val) => val - 20);

  // BUTTERY SMOOTH SPRING SETTINGS
  const cardX = useSpring(0, { stiffness: 80, damping: 40 });
  const cardY = useSpring(0, { stiffness: 80, damping: 40 });

  // FIXED ROTATION MATH: Now tilts TOWARD the cursor
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
        const buffer = 100;
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
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-red-500 font-mono animate-pulse text-xs italic uppercase tracking-[0.3em]">
          connecting_to_mainframes...
        </div>
      </div>
    );

  const status = lanyard.discord_status;
  const accentColor = "#ef4444"; // Bold Red for contrast

  return (
    // LIGHTER SILVER-WHITE BACKGROUND
    <div className="relative min-h-screen bg-[#e2e8f0] overflow-hidden selection:bg-red-500/30">
      {/* Subtle Background Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full blur-[180px] opacity-[0.12] pointer-events-none z-0"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: accentColor,
        }}
      />

      <div className="min-h-screen text-gray-900 font-sans flex items-center justify-center p-4 lg:p-12 z-10 relative">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Profile Card with Heavy Shadow */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[360px] bg-white border border-black/5 backdrop-blur-3xl p-8 rounded-[2.5rem] text-center shadow-[0_45px_100px_rgba(0,0,0,0.18)]"
            >
              <div
                className="relative inline-block mb-6"
                style={{ transform: "translateZ(80px)" }}
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="relative w-28 h-28 rounded-full ring-4 ring-black/5 bg-gray-200 object-cover z-10"
                  alt="avatar"
                />
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white z-30 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                ></div>
              </div>

              <h1
                style={{ transform: "translateZ(50px)" }}
                className="text-4xl font-black tracking-tighter italic uppercase text-gray-950 leading-none mb-1"
              >
                {lanyard.discord_user.global_name || "zxrqi"}
              </h1>
              <p
                style={{ transform: "translateZ(40px)", color: accentColor }}
                className="font-mono text-[10px] tracking-[0.4em] mb-8 uppercase font-bold text-center"
              >
                Full-Stack Architect
              </p>

              <div
                className="space-y-3 mb-8"
                style={{ transform: "translateZ(30px)" }}
              >
                <ActivityRow
                  label="Process"
                  value={
                    lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Online"
                  }
                />
                <ActivityRow label="Clock" value={time} />
              </div>

              <button
                onClick={() =>
                  window.open(`https://discord.com/users/${DISCORD_ID}`)
                }
                style={{
                  backgroundColor: accentColor,
                  transform: "translateZ(60px)",
                }}
                className="w-full py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xl text-white"
              >
                Secure Link <ExternalLink size={14} />
              </button>
            </motion.div>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white border border-black/5 p-6 rounded-3xl backdrop-blur-xl group hover:bg-black/[0.04] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                >
                  <div className={`mb-4`} style={{ color: accentColor }}>
                    {proj.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">{proj.name}</h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              ))}
              <div className="bg-white border border-black/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <div>
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase mb-3"
                    style={{ color: accentColor }}
                  >
                    <Disc
                      className={lanyard.spotify ? "animate-spin-slow" : ""}
                      size={14}
                    />{" "}
                    {lanyard.spotify ? "Live Stream" : "System Core"}
                  </div>
                  <p className="text-sm text-gray-800 font-medium leading-snug">
                    {lanyard.spotify
                      ? `Playing: ${lanyard.spotify.song}`
                      : "Resources optimized. No active media found."}
                  </p>
                </div>
                <div className="mt-6 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["5%", "95%", "5%"] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="h-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Signal" value={status.toUpperCase()} />
              <StatBox label="Node" value="Asia_DL" />
              <StatBox label="Relay" value="0.002ms" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="bg-black/[0.03] p-4 rounded-2xl border border-black/5 flex flex-col text-left">
      <p className="text-[9px] text-gray-600 font-black uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium truncate text-gray-900">{value}</p>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <p className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-tighter">
        {label}
      </p>
      <p className="text-[11px] font-mono font-bold uppercase text-gray-950">
        {value}
      </p>
    </div>
  );
}

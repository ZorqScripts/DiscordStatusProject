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

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

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
        <div className="text-white font-mono animate-pulse italic uppercase tracking-widest text-xs">
          syncing_status...
        </div>
      </div>
    );

  // LOGIC FOR DYNAMIC STATUS GLOW
  const status = lanyard.discord_status;
  const statusColors = {
    online: "#22c55e", // Green
    dnd: "#ef4444", // Red
    idle: "#f59e0b", // Yellow
    offline: "#64748b", // Grey
  };
  const activeStatusColor = statusColors[status] || statusColors.offline;

  return (
    <div className="relative min-h-screen bg-[#0a0f1e] overflow-hidden selection:bg-white/20">
      {/* DYNAMIC GLOW: Changes color based on status */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.25] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeStatusColor,
        }}
      />

      {/* INVERTING RED CURSOR: High visibility, flips underlying colors */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference border-[3px] border-red-600 bg-red-600/10"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="min-h-screen text-white/90 font-sans flex items-center justify-center p-4 lg:p-12 z-10 relative">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Card with Glassmorphism */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-[360px] bg-white/[0.03] border border-white/10 backdrop-blur-[30px] p-8 rounded-[2.5rem] text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
              <div
                className="relative inline-block mb-6"
                style={{ transform: "translateZ(80px)" }}
              >
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="relative w-28 h-28 rounded-full ring-2 ring-white/10 bg-black/20 object-cover z-10 shadow-2xl"
                  alt="avatar"
                />
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-[#0a0f1e] z-30 shadow-lg"
                  style={{ backgroundColor: activeStatusColor }}
                ></div>
              </div>

              <h1
                style={{ transform: "translateZ(50px)" }}
                className="text-3xl font-black tracking-tighter uppercase text-white leading-none mb-1"
              >
                {lanyard.discord_user.global_name || "zxrqi"}
              </h1>
              <p
                style={{
                  transform: "translateZ(40px)",
                  color: activeStatusColor,
                }}
                className="font-mono text-[9px] tracking-[0.4em] mb-8 uppercase font-bold"
              >
                {status} Protocol Active
              </p>

              <div
                className="space-y-3 mb-8"
                style={{ transform: "translateZ(30px)" }}
              >
                <ActivityRow
                  label="Process"
                  value={
                    lanyard.activities?.find((a) => a.type === 4)?.state ||
                    "Scanning..."
                  }
                />
                <ActivityRow label="Time" value={time} />
              </div>

              <button
                onClick={() =>
                  window.open(`https://discord.com/users/${DISCORD_ID}`)
                }
                style={{
                  backgroundColor: activeStatusColor,
                  transform: "translateZ(60px)",
                }}
                className="w-full py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xl"
              >
                Access Profile <ExternalLink size={14} />
              </button>
            </motion.div>
          </div>

          {/* Info Panels */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:bg-white/[0.05] transition-all shadow-xl group"
                >
                  <div
                    className="mb-4 transition-colors group-hover:text-white"
                    style={{ color: activeStatusColor }}
                  >
                    {proj.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">{proj.name}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              ))}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
                <div>
                  <div
                    className="flex items-center gap-2 text-[10px] font-black uppercase mb-3"
                    style={{ color: activeStatusColor }}
                  >
                    <Disc
                      className={lanyard.spotify ? "animate-spin-slow" : ""}
                      size={14}
                    />{" "}
                    {lanyard.spotify ? "Signal Found" : "Signal Lost"}
                  </div>
                  <p className="text-sm text-white/70 font-medium leading-snug">
                    {lanyard.spotify
                      ? lanyard.spotify.song
                      : "Ambient system noise detected."}
                  </p>
                </div>
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["10%", "90%", "10%"] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="h-full"
                    style={{ backgroundColor: activeStatusColor }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox
                label="Status"
                value={status.toUpperCase()}
                color={activeStatusColor}
              />
              <StatBox label="Latency" value="2.4ms" />
              <StatBox label="System" value="V3.2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col text-left">
      <p className="text-[9px] text-white/20 font-black uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium truncate text-white/80">{value}</p>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
      <p className="text-[10px] text-white/20 font-black uppercase mb-1">
        {label}
      </p>
      <p
        className="text-[11px] font-mono font-bold"
        style={{ color: color || "white" }}
      >
        {value}
      </p>
    </div>
  );
}

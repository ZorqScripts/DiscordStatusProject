import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ExternalLink,
  Globe,
  Bot,
  Zap,
  Server,
  Share2,
  Disc,
  Cpu,
  Terminal,
  Eye,
  Activity,
  Power,
  ZapOff,
  Monitor,
} from "lucide-react";

const DISCORD_ID = "900965149496737874";

// --- COMMAND PALETTE ---
const CommandPalette = ({ isOpen, onClose, activeColor }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState(['> TYPE "HELP" FOR COMMANDS']);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.toLowerCase().trim();
      let response = "";
      if (cmd === "help") response = "AVAIL: DISCORD, CLEAR, EXIT, SPECS";
      else if (cmd === "specs")
        response = "RUNNING_DIAGNOSTICS... (Check Terminal)";
      else if (cmd === "discord") {
        window.open(`https://discord.com/users/${DISCORD_ID}`);
        response = "LINKING...";
      } else if (cmd === "clear") {
        setHistory(["> CACHE_CLEARED"]);
        setInput("");
        return;
      } else if (cmd === "exit") {
        onClose();
        return;
      } else response = `ERR: ${cmd.toUpperCase()}_NOT_FOUND`;

      setHistory((prev) => [
        ...prev.slice(-3),
        `> ${cmd.toUpperCase()}`,
        response,
      ]);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[20000] flex items-center justify-center backdrop-blur-sm bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-full max-w-[400px] bg-[#050505] border-[4px] border-[#1a1a1a] p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a0f0a] border border-[#222] p-4 font-mono">
              <div className="h-24 text-[10px] text-green-500/80 mb-4 overflow-hidden flex flex-col justify-end">
                {history.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-black/50 p-2 border border-green-900/20">
                <span className="text-green-500 text-xs">$</span>
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  className="bg-transparent border-none outline-none text-green-400 text-xs w-full"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- ENTRY SCREEN ---
const EntryScreen = ({ onEnter, activeColor, cursorX, cursorY }) => {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      onClick={onEnter}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050508] cursor-none"
    >
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[10001] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />
      <h1 className="text-5xl md:text-7xl font-black italic text-white mb-2">
        WELCOME, <span style={{ color: activeColor }}>VISITOR.</span>
      </h1>
      <p className="font-mono text-[10px] tracking-[0.5em] text-white/30 mb-12 uppercase">
        Establishing secure handshake
      </p>
      <div className="px-10 py-5 rounded-full border border-white/5 bg-white/[0.02] text-[12px] font-black uppercase tracking-[0.4em] text-white/60">
        Access Mainframe
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
const MainPage = ({
  lanyard,
  time,
  cursorX,
  cursorY,
  cardRotateX,
  cardRotateY,
  bgTextX,
  bgTextY,
  activeColor,
  status,
  cardRef,
}) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isOverclock, setIsOverclock] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [logs, setLogs] = useState([]);
  const [visitorSpecs, setVisitorSpecs] = useState(null);

  // Overclock Colors & Theme
  const themeColor = isOverclock ? "#ff0033" : activeColor;

  const getSpecs = () => {
    const specs = {
      os: navigator.platform,
      cores: navigator.hardwareConcurrency || "Unknown",
      ram: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : "Unknown",
      agent:
        navigator.userAgent.split(") ")[0].split(" (")[1] || "Generic Client",
      gpu: "Detecting...",
    };
    setVisitorSpecs(specs);
    addLog(
      `DIAGNOSTIC: ARCHITECTURE=${specs.os} | CORES=${specs.cores} | RAM=${specs.ram}`,
    );
  };

  const addLog = (msg) =>
    setLogs((prev) => [...prev.slice(-8), { id: Math.random(), text: msg }]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLowPower) {
        const phrases = [
          "Kernel stabilized",
          "Memory heap optimized",
          "Handshake active",
          "Latency: 0.002ms",
        ];
        addLog(
          `SYSTEM: ${phrases[Math.floor(Math.random() * phrases.length)]}`,
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isLowPower]);

  return (
    <motion.div
      animate={{
        filter: isLowPower
          ? "grayscale(1) brightness(0.6)"
          : isOverclock
            ? "contrast(1.2) brightness(1.1)"
            : "none",
        backgroundColor: isOverclock ? "#100000" : "#08080c",
      }}
      className="relative min-h-screen overflow-hidden text-white font-sans cursor-none"
    >
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        activeColor={themeColor}
      />

      {/* Overclock CRT Overlay */}
      {isOverclock && (
        <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse" />
      )}

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: themeColor,
        }}
      />

      <div className="min-h-screen flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Profile Card */}
          <motion.div
            ref={cardRef}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d",
            }}
            className="lg:col-span-4 bg-[#0f0f11] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center shadow-2xl"
          >
            <div className="relative mb-6">
              <img
                src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                className="w-32 h-32 rounded-full border-4 border-zinc-800 object-cover"
                alt="Avatar"
              />
              <div
                className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-[#0f0f11]"
                style={{ backgroundColor: themeColor }}
              />
            </div>
            <h1 className="text-3xl font-black uppercase italic">Zorq</h1>
            <p
              className="text-[9px] font-black uppercase tracking-[0.2em] mb-8"
              style={{ color: themeColor }}
            >
              {isOverclock ? "OVERCLOCKED_ARCHITECT" : "Full-Stack Architect"}
            </p>

            {/* System Specs Readout */}
            <AnimatePresence>
              {visitorSpecs && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl mb-4 font-mono text-[9px] space-y-1"
                >
                  <div className="flex justify-between text-white/40">
                    <span>CPU_CORES:</span>{" "}
                    <span className="text-white">{visitorSpecs.cores}</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>V_MEMORY:</span>{" "}
                    <span className="text-white">{visitorSpecs.ram}</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>ARCH:</span>{" "}
                    <span className="text-white">{visitorSpecs.os}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={getSpecs}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <Monitor size={12} /> Scan Hardware
            </button>
            <button
              style={{ backgroundColor: themeColor }}
              className="w-full mt-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
            >
              Secure Link <ExternalLink size={14} />
            </button>
          </motion.div>

          {/* Side Content */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {[
                { name: "Infrastructure", icon: <Server size={18} /> },
                { name: "Automation", icon: <Bot size={18} /> },
                { name: "Optimization", icon: <Zap size={18} /> },
                { name: "Security", icon: <Terminal size={18} /> },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f11] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-all"
                >
                  <div style={{ color: themeColor }} className="mb-3">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-[11px] text-white/30">
                    System-level architecture and deployment.
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsOverclock(!isOverclock);
                  setIsLowPower(false);
                  addLog(
                    isOverclock
                      ? "SYSTEM: STABILIZING_CLOCKS"
                      : "WARNING: CLOCK_SPEED_CRITICAL",
                  );
                }}
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${isOverclock ? "bg-red-500 text-white border-red-400 animate-pulse" : "bg-white/5 border-white/10 text-white/60 hover:text-white"}`}
              >
                {isOverclock ? <Zap size={14} /> : <ZapOff size={14} />}{" "}
                {isOverclock ? "OVERCLOCK_ACTIVE" : "OVERCLOCK_SYSTEM"}
              </button>
              <button
                onClick={() => setIsLowPower(!isLowPower)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40"
              >
                <Power size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-1 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.p
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[10px] uppercase tracking-tighter"
            >
              <span style={{ color: themeColor }}>&gt;</span> {log.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl">
        <p className="text-2xl font-black tracking-[0.4em] font-mono italic text-white/80">
          {time}
        </p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState("");
  const mainCardRef = useRef(null);
  const cursorX = useSpring(0, { stiffness: 600, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 25 });
  const cardRotateX = useSpring(0);
  const cardRotateY = useSpring(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
      );
      const json = await res.json();
      if (json.success) setLanyard(json.data);
    };
    fetchData();
    setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    window.addEventListener("mousemove", (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    });
  }, []);

  if (!lanyard) return <div className="bg-[#08080c] min-h-screen" />;
  const activeColor =
    { online: "#22c55e", dnd: "#ef4444", idle: "#f59e0b" }[
      lanyard.discord_status
    ] || "#64748b";

  return (
    <AnimatePresence>
      {!hasEntered ? (
        <EntryScreen
          key="e"
          onEnter={() => setHasEntered(true)}
          activeColor={activeColor}
          cursorX={cursorX}
          cursorY={cursorY}
        />
      ) : (
        <MainPage
          key="m"
          lanyard={lanyard}
          time={time}
          cursorX={cursorX}
          cursorY={cursorY}
          cardRotateX={cardRotateX}
          cardRotateY={cardRotateY}
          activeColor={activeColor}
          cardRef={mainCardRef}
        />
      )}
    </AnimatePresence>
  );
}

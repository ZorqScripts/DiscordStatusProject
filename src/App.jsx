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
  Command,
  Search,
  Activity,
} from "lucide-react";

const DISCORD_ID = "900965149496737874";

// --- TYPEWRITER COMPONENT ---
const TypewriterBio = ({ activeColor }) => {
  const roles = [
    "Full-Stack Architect",
    "Automation Expert",
    "System Designer",
    "Mechanics Specialist",
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const speed = isDeleting ? 50 : 100;

  useEffect(() => {
    const handleType = () => {
      const currentRole = roles[index % roles.length];
      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setIndex(index + 1);
        }
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        if (displayText === currentRole) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-8 h-4">
      <span style={{ color: activeColor }}>{displayText}</span>
      <span className="animate-pulse ml-1" style={{ color: activeColor }}>
        |
      </span>
    </p>
  );
};

// --- COOL SMD COMMAND PALETTE ---
const CommandPalette = ({ isOpen, onClose, activeColor }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "> SMD_BOOT_SEQUENCE_COMPLETE",
    '> TYPE "HELP" FOR COMMANDS',
  ]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.toLowerCase().trim();
      let response = "";
      if (cmd === "help") response = "AVAIL: DISCORD, CLEAR, EXIT";
      else if (cmd === "discord") {
        window.open(`https://discord.com/users/${DISCORD_ID}`);
        response = "LINKING_EXTERNAL...";
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
          className="fixed inset-0 z-[20000] flex items-center justify-center backdrop-blur-sm bg-black/40 cursor-default"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, rotateX: 20 }}
            animate={{ scale: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-[400px] bg-[#050505] border-[4px] border-[#1a1a1a] rounded-sm p-1 shadow-[0_0_50px_rgba(0,0,0,1)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a0f0a] border border-[#222] p-4 rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 pointer-events-none bg-[length:100%_3px,3px_100%]" />

              <div className="flex items-center justify-between mb-4 border-b border-green-900/30 pb-2">
                <div className="flex items-center gap-2">
                  <Activity
                    size={12}
                    className="text-green-500 animate-pulse"
                  />
                  <span className="text-[9px] font-mono text-green-500/50 uppercase tracking-tighter text-xs">
                    SMD_PROMPT_V2.1
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </div>

              <div className="h-24 font-mono text-[10px] text-green-500/80 mb-4 overflow-hidden flex flex-col justify-end">
                {history.map((line, i) => (
                  <div key={i} className="leading-tight">
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-black/50 p-2 border border-green-900/20">
                <span className="text-green-500 text-xs font-mono">$</span>
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  className="bg-transparent border-none outline-none text-green-400 font-mono text-xs w-full caret-green-500"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
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
  const isPlaying = !!lanyard.spotify || lanyard.listening_to_spotify;
  const customStatus = lanyard.activities?.find((a) => a.type === 4)?.state;
  const [isLevelHovered, setIsLevelHovered] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "`") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const addLog = (msg) =>
      setLogs((prev) => [...prev.slice(-8), { id: Date.now(), text: msg }]);
    const interval = setInterval(() => {
      const phrases = [
        "Kernel stabilized",
        "Memory heap optimized",
        "Handshake active",
        "Encrypted link maintained",
        "Latency stabilized at 0.002ms",
      ];
      addLog(`SYSTEM: ${phrases[Math.floor(Math.random() * phrases.length)]}`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateLevel = () => {
    const birthDate = new Date(2008, 5, 20);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const calculateYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return ((now - start) / (end - start)) * 100;
  };

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
      desc: "Environment deployment.",
      icon: <Server size={18} />,
    },
    {
      name: "Cross-Platform Sync",
      desc: "Discord relay bridges.",
      icon: <Share2 size={18} />,
    },
    {
      name: "Web Infrastructure",
      desc: "High-availability hosting.",
      icon: <Globe size={18} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative min-h-screen bg-[#08080c] overflow-hidden text-white font-sans selection:bg-white/10 cursor-none"
    >
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        activeColor={activeColor}
      />

      <div className="fixed top-12 right-12 z-[100] opacity-40 font-black text-4xl tracking-tighter uppercase italic select-none font-mono">
        zorq.page
      </div>
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.15] pointer-events-none z-0"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: activeColor,
        }}
      />
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
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <motion.div
            ref={cardRef}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformStyle: "preserve-3d",
            }}
            className="lg:col-span-4 bg-[#0f0f11] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center relative z-20"
          >
            <div className="flex flex-col items-center w-full">
              <div className="relative mb-6">
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="w-32 h-32 rounded-full border-4 border-zinc-800 object-cover shadow-2xl"
                />
                <motion.div
                  animate={{
                    filter: [
                      "brightness(1.5) drop-shadow(0 0 8px currentColor)",
                      "brightness(0.6) drop-shadow(0 0 0px currentColor)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-[#0f0f11]"
                  style={{ backgroundColor: activeColor, color: activeColor }}
                />
              </div>
              <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase">
                Zorq
              </h1>
              {/* BIO TYPEWRITER ADDED HERE */}
              <TypewriterBio activeColor={activeColor} />

              <div className="w-full space-y-3 text-left mb-auto">
                <motion.div
                  onMouseEnter={() => setIsLevelHovered(true)}
                  onMouseLeave={() => setIsLevelHovered(false)}
                  className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl w-full"
                >
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                      Current Level
                    </p>
                    <p className="text-2xl font-black tracking-tighter italic">
                      {calculateLevel()}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateYearProgress()}%` }}
                      style={{ backgroundColor: activeColor }}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <button
              style={{ backgroundColor: activeColor }}
              className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-xl transition-all"
            >
              Secure Link <ExternalLink size={14} />
            </button>
          </motion.div>

          <div className="lg:col-span-8 flex flex-col gap-4 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f11] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-all flex flex-col justify-center relative group"
                >
                  <div
                    style={{ color: activeColor }}
                    className="mb-3 transition-transform group-hover:scale-110 group-hover:rotate-6"
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                  <p className="text-[11px] text-white/30 leading-snug">
                    {p.desc}
                  </p>
                </div>
              ))}
              <div className="bg-[#0f0f11] border border-white/10 rounded-[2rem] p-5 flex items-center gap-4 relative overflow-hidden">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full bg-zinc-900 border-[3px] border-zinc-800 flex items-center justify-center overflow-hidden"
                  >
                    {isPlaying && lanyard.spotify ? (
                      <img
                        src={lanyard.spotify.album_art_url}
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : (
                      <Disc size={16} className="opacity-20 text-white" />
                    )}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black uppercase tracking-widest text-green-500 mb-1 flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/10"}`}
                    />
                    {isPlaying ? "Spotify" : "Offline"}
                  </p>
                  <h3 className="text-xs font-bold truncate text-white/90">
                    {isPlaying && lanyard.spotify
                      ? lanyard.spotify.song
                      : "Awaiting Signal..."}
                  </h3>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl">
                <p className="text-[8px] opacity-60 font-black uppercase mb-0.5">
                  Signal
                </p>
                <p
                  className="text-[10px] font-bold uppercase"
                  style={{ color: activeColor }}
                >
                  {status}
                </p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl">
                <p className="text-[8px] opacity-60 font-black uppercase mb-0.5">
                  Location
                </p>
                <p className="text-[10px] font-bold">INDIA</p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl">
                <p className="text-[8px] opacity-60 font-black uppercase mb-0.5">
                  Ping
                </p>
                <p className="text-[10px] font-bold">0.002MS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-[100] px-8 pb-8 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-2 max-w-lg">
          <div className="flex items-center gap-2 mb-2 opacity-30">
            <Terminal size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Mainframe_Live_Log
            </span>
          </div>
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.p
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.5, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-3"
              >
                <span
                  style={{ color: activeColor }}
                  className="font-bold shrink-0"
                >
                  &gt;&gt;
                </span>
                <span className="truncate">{log.text}</span>
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        <div className="pointer-events-auto group flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-full opacity-40 hover:opacity-100 transition-opacity">
          <Terminal size={14} />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
            Press ` to open command prompt
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- APP WRAPPER (UNCHANGED) ---
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const mainCardRef = useRef(null);
  const cursorX = useSpring(0, { stiffness: 600, damping: 25 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 25 });
  const cardRotateX = useSpring(0, { stiffness: 100, damping: 30 });
  const cardRotateY = useSpring(0, { stiffness: 100, damping: 30 });
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
    const dInt = setInterval(fetchData, 10000);
    const tInt = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    const handleMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (mainCardRef.current) {
        const rect = mainCardRef.current.getBoundingClientRect();
        const isNear =
          e.clientX >= rect.left - 100 &&
          e.clientX <= rect.right + 100 &&
          e.clientY >= rect.top - 100 &&
          e.clientY <= rect.bottom + 100;
        if (isNear) {
          cardRotateX.set((e.clientY - (rect.top + rect.height / 2)) / 20);
          cardRotateY.set(-(e.clientX - (rect.left + rect.width / 2)) / 20);
        } else {
          cardRotateX.set(0);
          cardRotateY.set(0);
        }
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      clearInterval(dInt);
      clearInterval(tInt);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [cursorX, cursorY, cardRotateX, cardRotateY]);

  if (!lanyard) return <div className="min-h-screen bg-[#08080c]" />;
  const status = lanyard.discord_status;
  const statusColors = {
    online: "#22c55e",
    dnd: "#ef4444",
    idle: "#f59e0b",
    offline: "#64748b",
  };
  const activeColor = statusColors[status] || statusColors.offline;

  return (
    <AnimatePresence mode="wait">
      {!hasEntered ? (
        <EntryScreen
          key="entry"
          onEnter={() => setHasEntered(true)}
          activeColor={activeColor}
          cursorX={cursorX}
          cursorY={cursorY}
        />
      ) : (
        <MainPage
          key="main"
          lanyard={lanyard}
          time={time}
          cursorX={cursorX}
          cursorY={cursorY}
          cardRotateX={cardRotateX}
          cardRotateY={cardRotateY}
          bgTextX={bgTextX}
          bgTextY={bgTextY}
          activeColor={activeColor}
          status={status}
          cardRef={mainCardRef}
        />
      )}
    </AnimatePresence>
  );
}

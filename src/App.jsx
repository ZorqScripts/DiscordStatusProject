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
  MousePointer2,
} from "lucide-react";

const DISCORD_ID = "900965149496737874";

// --- ENTRY SCREEN COMPONENT ---
const EntryScreen = ({ onEnter, activeColor }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onClick={onEnter}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#08080c]/80 backdrop-blur-3xl cursor-pointer"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-2xl"
          style={{
            backgroundColor: activeColor,
            boxShadow: `0 0 30px ${activeColor}44`,
          }}
        >
          <MousePointer2 className="text-white" size={28} />
        </div>
        <h2 className="text-white font-black uppercase tracking-[0.4em] text-sm opacity-80">
          Establish Connection
        </h2>
        <p className="text-white/20 text-[10px] font-bold mt-2 uppercase tracking-widest">
          Click anywhere to initialize
        </p>
      </motion.div>
    </motion.div>
  );
};

// --- YOUR MAIN PAGE (UNTOUCHED) ---
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
}) => {
  const cardRef = useRef(null);
  const isPlaying = !!lanyard.spotify;

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
    <div className="relative min-h-screen bg-[#08080c] overflow-hidden text-white font-sans selection:bg-white/10">
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
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
            className="lg:col-span-4 bg-[#0f0f11] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center"
          >
            <div className="flex flex-col items-center w-full">
              <div className="relative mb-6">
                <img
                  src={`https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=512`}
                  className="w-24 h-24 rounded-full border-4 border-zinc-800 object-cover"
                />
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#0f0f11]"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
              <h1 className="text-3xl font-black tracking-tighter mb-1">
                ZORQ
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500/80 mb-8">
                Full-Stack Architect
              </p>

              <div className="w-full space-y-3 text-left mb-auto">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl w-full">
                  <p className="text-[9px] opacity-30 font-black uppercase mb-1">
                    Process
                  </p>
                  <p className="text-xs font-bold truncate">
                    {lanyard.activities?.find((a) => a.type === 4)?.state ||
                      "Zzzzz"}
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl w-full">
                  <p className="text-[9px] opacity-30 font-black uppercase mb-1 font-sans">
                    Clock
                  </p>
                  <p className="text-xs font-bold opacity-80 font-mono">
                    {time}
                  </p>
                </div>
              </div>
            </div>

            <button
              style={{ backgroundColor: activeColor }}
              className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-xl transition-all"
            >
              Secure Link <ExternalLink size={14} />
            </button>
          </motion.div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f11] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-all flex flex-col justify-center"
                >
                  <div style={{ color: activeColor }} className="mb-3">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                  <p className="text-[11px] text-white/30 leading-snug">
                    {p.desc}
                  </p>
                </div>
              ))}

              <div className="bg-[#0f0f11] border border-white/10 rounded-[2rem] p-5 flex items-center gap-4 relative overflow-hidden group">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full bg-zinc-900 border-[3px] border-zinc-800 flex items-center justify-center shadow-lg overflow-hidden"
                  >
                    {isPlaying ? (
                      <img
                        src={lanyard.spotify.album_art_url}
                        className="w-full h-full object-cover opacity-60"
                        alt="album art"
                      />
                    ) : (
                      <Disc size={16} className="opacity-20 text-white" />
                    )}
                    <div className="absolute w-2 h-2 bg-[#0f0f11] rounded-full border border-white/10" />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1 flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/10"}`}
                    />
                    {isPlaying ? "Spotify" : "Offline"}
                  </p>
                  <h3 className="text-xs font-bold truncate text-white/90">
                    {isPlaying ? lanyard.spotify.song : "Awaiting Signal..."}
                  </h3>
                  <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isPlaying ? "70%" : "0%" }}
                      className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] opacity-20 font-black uppercase mb-0.5">
                  Signal
                </p>
                <p
                  className="text-[10px] font-bold uppercase"
                  style={{ color: activeColor }}
                >
                  {status}
                </p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] opacity-20 font-black uppercase mb-0.5">
                  Node
                </p>
                <p className="text-[10px] font-bold">ASIA_DL</p>
              </div>
              <div className="bg-[#0f0f11] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] opacity-20 font-black uppercase mb-0.5">
                  Relay
                </p>
                <p className="text-[10px] font-bold">0.002MS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP WRAPPER ---
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lanyard, setLanyard] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

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
    const dInt = setInterval(fetchData, 30000);
    const tInt = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );

    const handleMouse = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      // Logic for card tilt proximity (kept in the main loop to ensure it feels smooth on enter)
      const rect = document
        .querySelector('[ref="cardRef"]')
        ?.getBoundingClientRect();
      if (rect) {
        const isNear =
          e.clientX >= rect.left - 50 &&
          e.clientX <= rect.right + 50 &&
          e.clientY >= rect.top - 50 &&
          e.clientY <= rect.bottom + 50;
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
        />
      )}
    </AnimatePresence>
  );
}

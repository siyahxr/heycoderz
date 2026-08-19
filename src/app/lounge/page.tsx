"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Flame, 
  Sparkles, 
  Coffee, 
  CloudRain, 
  Radio, 
  Users, 
  Moon, 
  Check,
  Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type SoundType = "synth" | "rain" | "drone" | "coffee";

interface FocusTask {
  id: string;
  text: string;
  completed: boolean;
}

export default function DevLoungePage() {
  const { user } = useAuth();

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Web Audio Synth & Ambient Sound State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>("synth");
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Tasks Checklist
  const [tasks, setTasks] = useState<FocusTask[]>([
    { id: "1", text: "Next.js 16 bileşen mimarisini optimize et", completed: true },
    { id: "2", text: "API endpoint tiplerini TypeScript'e dök", completed: false },
    { id: "3", text: "Unit testleri ve build testini çalıştır", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // Dev Status
  const [userStatus, setUserStatus] = useState("🔥 Derin Odaklanma (Deep Work)");

  // Active devs simulation
  const activeDevs = [
    { name: "$", username: "siyah", role: "Kurucu", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", status: "Next.js mimarisi kodluyor" },
    { name: "Öykü", username: "oyku", role: "Kurucu Ortak", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80", status: "Figma & Tailwind tasarım" },
    { name: "Caner", username: "caner_dev", role: "Developer", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80", status: "Docker container optimize ediyor" },
    { name: "Selin", username: "selin_js", role: "Developer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80", status: "GraphQL sorgularını yazıyor" },
  ];

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === "work") {
        setSessionsCompleted((prev) => prev + 1);
        switchTimerMode("shortBreak");
      } else {
        switchTimerMode("work");
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, timerMode]);

  const switchTimerMode = (mode: "work" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === "work") setTimeLeft(25 * 60);
    else if (mode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Web Audio Synth Engine
  const stopAudioNodes = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    activeNodesRef.current = [];
  };

  const startSound = (sound: SoundType) => {
    stopAudioNodes();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (sound === "synth") {
        // Ambient chord synth (C minor 9th / peaceful frequency cluster)
        const freqs = [130.81, 155.56, 196.00, 233.08, 293.66]; // C3, Eb3, G3, Bb3, D4
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          const noteGain = ctx.createGain();

          osc.type = i % 2 === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(350 + i * 50, ctx.currentTime);

          // Subtle LFO sweep
          lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(40, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);

          noteGain.gain.setValueAtTime(0.12 / freqs.length, ctx.currentTime);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start();
          lfo.start();
          activeNodesRef.current.push(osc, lfo, filter, noteGain, lfoGain);
        });
      } else if (sound === "rain") {
        // Pink / White noise generator with lowpass filter for realistic rain
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = "lowpass";
        rainFilter.frequency.setValueAtTime(800, ctx.currentTime);

        whiteNoise.connect(rainFilter);
        rainFilter.connect(masterGain);
        whiteNoise.start();

        activeNodesRef.current.push(whiteNoise, rainFilter);
      } else if (sound === "drone") {
        // Deep space drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        const droneGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0.15, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);

        osc1.start();
        osc2.start();
        activeNodesRef.current.push(osc1, osc2, filter, droneGain);
      } else if (sound === "coffee") {
        // Warm cafe binaural frequencies
        [180, 220, 270, 330].forEach((freq) => {
          const osc = ctx.createOscillator();
          const f = ctx.createBiquadFilter();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          f.type = "bandpass";
          f.frequency.setValueAtTime(freq, ctx.currentTime);
          f.Q.setValueAtTime(3, ctx.currentTime);
          osc.connect(f);
          f.connect(masterGain);
          osc.start();
          activeNodesRef.current.push(osc, f);
        });
      }

      setIsPlayingAudio(true);
    } catch (err) {
      console.error("Audio synth error:", err);
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopAudioNodes();
      setIsPlayingAudio(false);
    } else {
      startSound(selectedSound);
    }
  };

  const changeSoundType = (type: SoundType) => {
    setSelectedSound(type);
    if (isPlayingAudio) {
      startSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioNodes();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Tasks actions
  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText("");
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Headphones className="w-3.5 h-3.5" />
              <span>heycoderz Co-Working & Odaklanma Odası</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Geliştirici{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                Dev Lounge
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Sentezlenmiş Lo-Fi synth sesleri, Pomodoro sayacı ve odaklanma listesi ile kesintisiz kodlama ortamı.
            </p>
          </div>

          {/* Active Presence Banner */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#09090F] border border-white/10 shadow-xl shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            <div>
              <span className="text-xs font-bold text-white block">14 Geliştirici Odada</span>
              <span className="text-[10px] text-gray-400 font-mono">Birlikte odaklanıyor</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Pomodoro Timer & Audio Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pomodoro Card */}
            <div className="p-8 rounded-3xl bg-[#09090F] border border-purple-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Mode Tabs */}
              <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => switchTimerMode("work")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    timerMode === "work"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  🎯 Odaklan (25dk)
                </button>
                <button
                  type="button"
                  onClick={() => switchTimerMode("shortBreak")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    timerMode === "shortBreak"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  ☕ Kısa Mola (5dk)
                </button>
                <button
                  type="button"
                  onClick={() => switchTimerMode("longBreak")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    timerMode === "longBreak"
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  🌴 Uzun Mola (15dk)
                </button>
              </div>

              {/* Huge Timer Digits */}
              <div className="py-4">
                <div className="font-mono text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 tracking-wider drop-shadow-2xl">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-400 font-mono mt-2 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  Tamamlanan Odak Seansı: <strong className="text-purple-300">{sessionsCompleted}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xl ${
                    isRunning
                      ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/40 scale-105"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Duraklat
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" /> Başlat
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchTimerMode(timerMode)}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ambient Sound Synthesizer Card */}
            <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Dahili Lo-Fi & Ambient Ses Sentezleyici</h3>
                    <p className="text-[11px] text-gray-400">Web Audio API ile anında üretilen rahatlatıcı ses dalgaları</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-lg shadow-red-500/20"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Sesi Durdur
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" /> Sesi Oynat
                    </>
                  )}
                </button>
              </div>

              {/* Sound Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "synth", name: "Synth Chill", icon: Sparkles, desc: "Sıcak synth akorları" },
                  { id: "rain", name: "Gece Yağmuru", icon: CloudRain, desc: "Filtreli pembe gürültü" },
                  { id: "drone", name: "Derin Uzay", icon: Moon, desc: "Düşük frekans drone" },
                  { id: "coffee", name: "Binaural Cafe", icon: Coffee, desc: "Rahatlatıcı tonlar" },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSel = selectedSound === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => changeSoundType(s.id as SoundType)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? "bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                          : "bg-black/40 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSel ? "text-indigo-300" : "text-gray-500"}`} />
                      <div>
                        <span className={`text-xs font-bold block ${isSel ? "text-white" : "text-gray-300"}`}>
                          {s.name}
                        </span>
                        <span className="text-[10px] text-gray-500 block truncate">{s.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-2">
                <Volume2 className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-400 w-10 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Focus Task List & Dev Presence (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Task Checklist Card */}
            <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    Odaklanma Görevleri
                  </h3>
                  <p className="text-[11px] text-gray-400">Bu seans boyunca bitirilecek maddeler</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg">
                  {completedCount} / {tasks.length} ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Task List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      task.completed
                        ? "bg-purple-950/20 border-purple-500/20 text-gray-400 line-through"
                        : "bg-black/40 border-white/5 text-white"
                    }`}
                  >
                    <div
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 mr-2"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                      <span className="text-xs">{task.text}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="text-gray-500 hover:text-red-400 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <form onSubmit={addTask} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Yeni odak görevi yaz..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Active Devs Presence List */}
            <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Odada Çalışan Geliştiriciler
              </h3>

              <div className="space-y-3">
                {activeDevs.map((dev) => (
                  <div key={dev.username} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={dev.avatar}
                          alt={dev.name}
                          className="w-8 h-8 rounded-lg object-cover border border-purple-500/30"
                        />
                        <div className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-black" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{dev.name}</span>
                          <span className="text-[10px] text-purple-400 font-mono">@{dev.username}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">{dev.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

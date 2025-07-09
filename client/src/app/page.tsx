"use client";

import type React from "react";
import Dashboard from "@/components/Dashboard";
import { useState } from "react";
import GameControls from "@/components/gameControls";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] p-4">
      <h1 className="mb-4 text-4xl font-bold text-[#ffffff] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Kingslayer
          </h1>
      {!isPlaying && (
        <div className="mb-8 max-w-2xl text-center">
          <h2 className="mb-6 text-2xl text-[#e0e0e0] italic">
            Friend, I welcome you to my awesome chess game, which I like to call
            Kingslayer
          </h2>
          <h2 className="mb-6 text-2xl text-[#e0e0e0] italic">
            Yeah, I know it does not look so awesome, and that is because this
            interface is built just to show you a view of the real objective of
            this project: the chess engine in the server, which is the only part
            that will keep improving , but enough presentation, click below to
            try it out
          </h2>
        </div>
      )}
      <GameControls setIsPlaying={setIsPlaying} />
      {isPlaying && <Dashboard />}
    </div>
  );
}

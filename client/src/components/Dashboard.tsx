"use client"

import Promote from "@/components/Promote";
import Board from "@/components/Board";
import { useChessContext } from "@/hooks/ChessContext";

function Dashboard() {
  const { isPromoting, bitboards, roleRef} = useChessContext();

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] p-4">
      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-4/5 flex-row gap-15 md:flex-row">
        {/* Games Panel - 40% width on medium screens and up */}
        {/* Game Area - 60% width on medium screens and up */}
        <div className="flex w-full flex-col items-center">
          {/* Chess Board Area */}
          {
            roleRef.current !== null && (
              <>
              {isPromoting && <Promote/>}
              {bitboards !== null && <Board/>}
              </>
            )
          }
            {}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
import React from "react";

interface CommerceHeroShellProps {
  leftContent: React.ReactNode;
  rightVisual: React.ReactNode;
}

export function CommerceHeroShell({
  leftContent,
  rightVisual,
}: CommerceHeroShellProps) {
  return (
    <div className="relative w-full bg-[#070B14] overflow-hidden flex flex-col min-h-[720px] lg:min-h-[800px] justify-between border-b border-slate-800/60 select-none">
      {/* Background Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-t from-blue-950/20 to-transparent" />
        {/* Subtle grid line overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-16 sm:pt-20 lg:pt-24 pb-14 flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
        {/* Left Copy Area */}
        <div className="w-full lg:w-[42%] xl:w-[40%] shrink-0">
          {leftContent}
        </div>

        {/* Right Visual Stage */}
        <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center lg:justify-end">
          {rightVisual}
        </div>
      </div>
    </div>
  );
}

'use client'

import { useId, useState, type ReactNode } from 'react'

const Candle = ({ className = "", scale = 1 }: { className?: string; scale?: number }) => (
  <div className={`add-candle-holder ${className}`} style={{ transform: `scale(${scale})` }}>
    <div className="add-candle">
      <div className="add-candle-blinking"></div>
      <div className="add-candle-glow"></div>
      <div className="add-candle-flame"></div>
      <div className="add-candle-thread"></div>
    </div>
  </div>
)


export function GraveFormBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-black relative overflow-x-hidden"
      style={{
        backgroundImage:
          'radial-gradient(800px 500px at 0% 0%, rgba(220,38,38,0.25), rgba(220,38,38,0.12) 35%, rgba(0,0,0,0) 70%)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
      }}
    >
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex justify-between px-8 pb-6">
        <div className="relative flex items-end mb-4">
          <Candle className="candle-variant-a" />
          <Candle className="candle-variant-b -ml-8 mb-4" scale={0.82} />
        </div>
        <div className="mb-6">
          <Candle className="candle-variant-c" scale={0.9} />
        </div>
      </div>
      <style jsx global>{`
        .add-candle-holder {
          position: relative;
          width: 90px;
          height: 160px;
          transform-origin: bottom center;
          filter: blur(1.6px);
        }

        .add-candle-holder *,
        .add-candle-holder *::before,
        .add-candle-holder *::after {
          position: absolute;
          content: "";
        }

        .add-candle {
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 90px / 32px;
          box-shadow: inset 14px -20px 40px 0 rgba(0, 0, 0, 0.45), inset -12px 0 35px 0 rgba(0, 0, 0, 0.35);
          background: linear-gradient(#f4a531, #ee8f12, #8a4107, #4c1a03 55%, #1b0901);
        }

        .add-candle::before {
          width: 100%;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #d47401;
          background: radial-gradient(#f2b246, #9c4d05 45%, #c66f0f 80%);
        }

        .add-candle::after {
          width: 26px;
          height: 8px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          top: 12px;
          box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.45);
          background: radial-gradient(rgba(0, 0, 0, 0.55), transparent 45%);
        }

        .add-candle-thread {
          width: 4px;
          height: 32px;
          top: -14px;
          left: 50%;
          z-index: 2;
          border-radius: 40% 40% 0 0;
          transform: translateX(-50%);
          background: linear-gradient(#dda251, #4b232c, #111, black, #f2c64d 90%);
        }

        .add-candle-flame {
          width: 18px;
          height: 96px;
          left: 50%;
          transform-origin: 50% 100%;
          transform: translateX(-50%);
          bottom: 100%;
          border-radius: 50% 50% 22% 22%;
          background: linear-gradient(white 78%, transparent);
          animation: add-moveFlame 6s linear infinite, add-enlargeFlame 5s linear infinite;
        }

        .add-candle-flame::before {
          width: 100%;
          height: 100%;
          border-radius: 50% 50% 22% 22%;
          box-shadow: 0 0 16px 0 rgba(247, 93, 0, 0.55), 0 -8px 6px 0 rgba(247, 128, 0, 0.75);
        }

        .add-candle-glow {
          width: 20px;
          height: 52px;
          border-radius: 50% 50% 35% 35%;
          left: 50%;
          top: -40px;
          transform: translateX(-50%);
          background: rgba(255, 195, 102, 0.68);
          box-shadow: 0 -40px 40px 0 rgba(255, 174, 66, 0.9), 0 36px 55px 0 rgba(255, 139, 0, 0.75), inset 3px 0 3px 0 rgba(255, 214, 153, 0.6), inset -3px 0 3px 0 rgba(255, 214, 153, 0.6);
        }

        .add-candle-glow::before {
          width: 72%;
          height: 60%;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.24);
        }

        .add-candle-blinking {
          width: 76px;
          height: 140px;
          left: 50%;
          top: -52%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(255, 150, 40, 0.6);
          filter: blur(55px);
          animation: add-blinkIt 2.8s infinite;
        }

        @keyframes add-moveFlame {
          0%, 100% {
            transform: translateX(-50%) rotate(-2deg);
          }
          50% {
            transform: translateX(-50%) rotate(2deg);
          }
        }

        @keyframes add-enlargeFlame {
          0%, 100% {
            height: 96px;
          }
          50% {
            height: 112px;
          }
        }

        @keyframes add-blinkIt {
          0%, 62% { opacity: 0.94; }
          64% { opacity: 0.38; }
          66% { opacity: 0.95; }
          68% { opacity: 0.42; }
          70% { opacity: 0.92; }
          72% { opacity: 0.4; }
          74% { opacity: 0.94; }
          76% { opacity: 0.37; }
          78% { opacity: 0.9; }
          80% { opacity: 0.45; }
          82% { opacity: 0.93; }
          84% { opacity: 0.4; }
          86% { opacity: 0.9; }
          100% { opacity: 0.94; }
        }

        .add-candle-holder.candle-variant-a .add-candle-blinking {
          animation-duration: 3.4s;
          animation-delay: 0.3s;
        }

        .add-candle-holder.candle-variant-a .add-candle-flame {
          animation: add-moveFlame 6.2s linear infinite, add-enlargeFlame 5.4s linear infinite;
        }

        .add-candle-holder.candle-variant-b .add-candle-blinking {
          animation-duration: 2.6s;
          animation-delay: -0.9s;
        }

        .add-candle-holder.candle-variant-b .add-candle-flame {
          animation: add-moveFlame 5.6s linear infinite, add-enlargeFlame 4.6s linear infinite;
        }

        .add-candle-holder.candle-variant-c .add-candle-blinking {
          animation-duration: 3.1s;
          animation-delay: 0.6s;
        }

        .add-candle-holder.candle-variant-c .add-candle-flame {
          animation: add-moveFlame 6.8s linear infinite, add-enlargeFlame 5.8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export function AutopsyDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/50">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
      >
        <span>In-Depth Autopsy <span className="font-normal text-zinc-400">(Optional)</span></span>
        <span aria-hidden="true" className={`size-2 shrink-0 border-b-2 border-r-2 border-zinc-400 motion-safe:transition-transform motion-safe:duration-200 ${open ? "rotate-[225deg]" : "rotate-45"}`} />
      </button>
      <div
        id={panelId}
        inert={!open}
        data-open={open}
        className="autopsy-panel"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="autopsy-panel-content space-y-6 px-4 pb-4 pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

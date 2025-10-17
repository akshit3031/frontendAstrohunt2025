// Optimized space-background with CSS-only animations
import { useMemo } from "react";

export default function SpaceBackground() {
  // Generate star positions once on mount (memoized)
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#0a0a2e] to-[#1a1a3e]">
      {/* Stars layer */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        />
      ))}

      {/* Add CSS animations in a style tag */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .star-twinkle {
          animation: twinkle infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

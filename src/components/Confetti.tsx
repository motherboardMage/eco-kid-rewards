
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const colors = [
      "#4CAF50", // Green
      "#8BC34A", // Light Green
      "#03A9F4", // Blue
      "#FFC107", // Yellow
      "#FF9800"  // Orange
    ];
    
    // Create confetti pieces
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100, // Start above the viewport
        size: 5 + Math.random() * 10,
        rotation: Math.random() * 360
      });
    }
    
    setPieces(newPieces);
    
    // Clean up after animation
    const timer = setTimeout(() => {
      setPieces([]);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti absolute"
          style={{
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;

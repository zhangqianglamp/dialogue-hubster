import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PuzzleCaptchaProps {
  onSuccess: () => void;
  onClose: () => void;
}

// 预定义的插画背景图片数组
const PUZZLE_IMAGES = [
  "/puzzles/puzzle1.jpg",  // 请确保这些图片存在于你的public目录下
  "/puzzles/puzzle2.jpg",
  "/puzzles/puzzle3.jpg",
  "/puzzles/puzzle4.jpg",
  "/puzzles/puzzle5.jpg",
];

export const PuzzleCaptcha = ({ onSuccess, onClose }: PuzzleCaptchaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [targetX, setTargetX] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<HTMLDivElement>(null);

  // 添加误差容忍范围
  const tolerance = 5;

  // 初始化随机图片和位置
  useEffect(() => {
    // 随机选择一张图片
    const randomImage = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    setImageUrl(randomImage);

    // 生成随机位置（在图片宽度的20%-70%之间）
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const min = width * 0.2;
      const max = width * 0.7;
      setTargetX(Math.floor(Math.random() * (max - min) + min));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - offsetX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - offsetX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newOffsetX = Math.max(0, Math.min(e.clientX - startX, getMaxOffset()));
    setOffsetX(newOffsetX);
    
    // 同步移动拼图块，确保精确对齐
    if (puzzleRef.current) {
      puzzleRef.current.style.transform = `translate(${newOffsetX}px, -50%)`;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // 防止页面滚动
    const newOffsetX = Math.max(0, Math.min(e.touches[0].clientX - startX, getMaxOffset()));
    setOffsetX(newOffsetX);
    
    // 同步移动拼图块，确保精确对齐
    if (puzzleRef.current) {
      puzzleRef.current.style.transform = `translate(${newOffsetX}px, -50%)`;
    }
  };

  const handleEnd = () => {
    if (isDragging) {
      checkSuccess();
    }
    setIsDragging(false);
  };

  const getMaxOffset = () => {
    if (!containerRef.current || !sliderRef.current) return 0;
    return containerRef.current.clientWidth - sliderRef.current.clientWidth;
  };

  const checkSuccess = () => {
    // 检查拼图块是否对齐（允许小范围误差）
    if (Math.abs(offsetX - targetX) <= tolerance) {
      setIsSuccess(true);
      // 精确对齐到目标位置
      setOffsetX(targetX);
      if (puzzleRef.current) {
        puzzleRef.current.style.transform = `translate(${targetX}px, -50%)`;
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } else {
      // 验证失败，滑块和拼图块返回起点
      setOffsetX(0);
      if (puzzleRef.current) {
        puzzleRef.current.style.transition = 'transform 0.3s ease-out';
        puzzleRef.current.style.transform = 'translate(0px, -50%)';
        setTimeout(() => {
          if (puzzleRef.current) {
            puzzleRef.current.style.transition = '';
          }
        }, 300);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, startX]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 text-center text-lg font-semibold">
          请完成拼图验证
        </div>
        <div className="space-y-4">
          {/* 拼图区域 */}
          <div
            ref={containerRef}
            className="relative h-48 overflow-hidden rounded-lg bg-muted"
          >
            {/* 背景图片 */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover'
              }}
            >
              {/* 拼图缺口 */}
              <svg
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${targetX}px` }}
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="rgba(0,0,0,0.45)"
              >
                <path d="M0,0 h44 v44 h-44 Z M22,0 a10,10 0 0 1 0,20 a10,10 0 0 1 0,-20 Z" />
              </svg>
            </div>
            {/* 可滑动的拼图块 */}
            <div
              ref={puzzleRef}
              className={cn(
                "absolute left-0 top-1/2 w-11 h-11 cursor-move select-none",
                isDragging && "opacity-95",
                isSuccess && "ring-2 ring-green-500"
              )}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `${-targetX}px 50%`,
                backgroundSize: 'cover',
                clipPath: "path('M0,0 h44 v44 h-44 Z M22,0 a10,10 0 0 1 0,20 a10,10 0 0 1 0,-20 Z')",
                transform: 'translate(0, -50%)',
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }}
            />
          </div>
          {/* 滑动条 */}
          <div
            className="relative h-12 rounded-lg bg-muted/80 backdrop-blur"
          >
            <div
              ref={sliderRef}
              className={cn(
                "absolute left-0 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-all",
                isSuccess ? "bg-green-500" : "bg-primary",
                isDragging && "scale-105"
              )}
              style={{ 
                transform: `translateX(${offsetX}px)`,
                transition: isDragging ? 'none' : 'all 0.3s ease-out'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="text-primary-foreground text-lg">
                {isSuccess ? "✓" : "→"}
              </div>
            </div>
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {isSuccess ? "验证成功" : "拖动滑块完成拼图"}
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}; 
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

interface SliderCaptchaProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const SliderCaptcha = ({ onSuccess, onClose }: SliderCaptchaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 重置状态
  const resetSlider = () => {
    setOffsetX(0);
    setIsFailed(false);
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
      sliderRef.current.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = '';
        }
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSuccess) {
      setIsDragging(true);
      setStartX(e.clientX);
      setIsFailed(false);
      if (sliderRef.current) {
        sliderRef.current.style.transition = '';
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSuccess) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setIsFailed(false);
      if (sliderRef.current) {
        sliderRef.current.style.transition = '';
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isSuccess) return;
    const maxOffset = getMaxOffset();
    const newOffsetX = Math.max(0, Math.min(e.clientX - startX, maxOffset));
    setOffsetX(newOffsetX);
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${newOffsetX}px)`;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || isSuccess) return;
    e.preventDefault();
    const maxOffset = getMaxOffset();
    const newOffsetX = Math.max(0, Math.min(e.touches[0].clientX - startX, maxOffset));
    setOffsetX(newOffsetX);
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${newOffsetX}px)`;
    }
  };

  const getMaxOffset = () => {
    if (!containerRef.current || !sliderRef.current) return 0;
    return containerRef.current.clientWidth - sliderRef.current.clientWidth;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const maxOffset = getMaxOffset();
    if (offsetX >= maxOffset * 0.95) { // 滑到95%以上判定成功
      setIsSuccess(true);
      setOffsetX(maxOffset);
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'transform 0.3s ease-in-out';
        sliderRef.current.style.transform = `translateX(${maxOffset}px)`;
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } else {
      setIsFailed(true);
      resetSlider();
    }
  };

  useEffect(() => {
    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, offsetX, isSuccess]);

  const progress = (offsetX / (getMaxOffset() || 1)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 text-center text-lg font-semibold">
          请完成滑块验证
        </div>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className={cn(
              "relative h-12 rounded-lg bg-muted/80 backdrop-blur overflow-hidden",
              isFailed && "animate-shake"
            )}
          >
            <Progress 
              value={progress} 
              className={cn(
                "absolute inset-0 rounded-lg transition-all",
                isSuccess ? "bg-green-500/20" : "bg-primary/20"
              )}
            />
            <div
              ref={sliderRef}
              className={cn(
                "absolute left-0 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-colors",
                isSuccess ? "bg-green-500" : "bg-primary",
                isDragging && "scale-105 shadow-lg brightness-110",
                !isSuccess && !isDragging && "hover:brightness-110",
                isFailed && "animate-shake"
              )}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="text-primary-foreground text-lg">
                {isSuccess ? "✓" : "→"}
              </div>
            </div>
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {isSuccess ? "验证成功" : isFailed ? "验证失败，请重试" : "向右滑动滑块"}
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
"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const updateOpacity = () => {
      if (!video) return;
      const { currentTime, duration } = video;

      if (currentTime < 0.5) {
        setOpacity(currentTime / 0.5);
      } else if (duration > 0 && duration - currentTime < 0.5) {
        setOpacity((duration - currentTime) / 0.5);
      } else {
        setOpacity(1);
      }

      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const onPlay = () => {
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const onPause = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const onEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch((e) => console.error("Video play failed", e));
        }
      }, 100);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ opacity, transition: "opacity 0.1s linear" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-transparent to-slate-50 dark:from-slate-950/80 dark:to-slate-950" />
    </div>
  );
}

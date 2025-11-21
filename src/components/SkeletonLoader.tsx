// src/components/SkeletonLoader.tsx
import React from "react";
import { motion } from "framer-motion";

type SkeletonType = "card" | "text" | "circle" | "chart" | "table";

type Props = {
  type?: SkeletonType;
  count?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
};

const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

export default function SkeletonLoader({ 
  type = "card",
  count = 1,
  height = "auto",
  width = "100%",
  className = ""
}: Props) {
  
  const baseStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    borderRadius: 12,
    overflow: "hidden"
  };

  const renderSkeleton = (index: number) => {
    switch (type) {
      case "card":
        return (
          <motion.div
            key={index}
            {...shimmer}
            className={`card card-aqm p-4 mb-3 ${className}`}
            style={baseStyle}
          >
            <div 
              style={{ 
                height: typeof height === "number" ? `${height}px` : height || 200,
                width
              }}
            />
          </motion.div>
        );

      case "circle":
        return (
          <motion.div
            key={index}
            {...shimmer}
            className={className}
            style={{
              ...baseStyle,
              borderRadius: "50%",
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height
            }}
          />
        );

      case "text":
        return (
          <motion.div
            key={index}
            {...shimmer}
            className={`mb-2 ${className}`}
            style={{
              ...baseStyle,
              height: typeof height === "number" ? `${height}px` : height || 20,
              width
            }}
          />
        );

      case "chart":
        return (
          <motion.div
            key={index}
            {...shimmer}
            className={`card card-aqm p-4 ${className}`}
            style={baseStyle}
          >
            <div style={{ height: height || 300, width }}>
              <div 
                style={{ 
                  height: "80%", 
                  background: "rgba(0,0,0,0.03)",
                  borderRadius: 8
                }} 
              />
            </div>
          </motion.div>
        );

      case "table":
        return (
          <motion.div
            key={index}
            {...shimmer}
            className={`card card-aqm p-3 ${className}`}
            style={baseStyle}
          >
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="d-flex gap-3 mb-3"
              >
                <div 
                  style={{ 
                    width: "30%", 
                    height: 16, 
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 4
                  }} 
                />
                <div 
                  style={{ 
                    width: "70%", 
                    height: 16, 
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: 4
                  }} 
                />
              </div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, i) => renderSkeleton(i))}
    </>
  );
}
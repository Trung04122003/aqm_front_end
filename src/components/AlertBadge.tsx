// src/components/AlertBadge.tsx
import { motion } from "framer-motion";

type Props = {
  count: number;
  variant?: "danger" | "warning" | "info";
  size?: "sm" | "md" | "lg";
};

export default function AlertBadge({ 
  count, 
  variant = "danger",
  size = "md" 
}: Props) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: "px-2 py-1",
    md: "px-2.5 py-1.5", 
    lg: "px-3 py-2"
  };

  const variantColors = {
    danger: "bg-danger",
    warning: "bg-warning",
    info: "bg-info"
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`badge ${variantColors[variant]} rounded-pill ${sizeClasses[size]} text-white fw-semibold`}
      style={{
        fontSize: size === "sm" ? "0.7rem" : size === "lg" ? "0.9rem" : "0.75rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}
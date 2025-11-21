// src/components/EmptyState.tsx
import React from "react";
import { motion } from "framer-motion";

type Props = {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export default function EmptyState({ 
  icon = "📭",
  title = "No Data Available",
  message = "There's nothing to display here yet.",
  action
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card card-aqm p-5 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-3"
        style={{ fontSize: "4rem" }}
      >
        {icon}
      </motion.div>

      <h5 className="mb-2" style={{ color: "#2d3748" }}>
        {title}
      </h5>

      <p className="text-muted mb-4" style={{ maxWidth: 400, margin: "0 auto" }}>
        {message}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={action.onClick}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
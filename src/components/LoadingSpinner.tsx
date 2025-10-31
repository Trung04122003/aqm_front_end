// import React from "react";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="d-flex align-items-center justify-content-center p-4">
      <div className="spinner-border" role="status" aria-hidden />
      <span className="ms-3 text-muted">{text}</span>
    </div>
  );
}

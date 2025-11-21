// src/components/ErrorBoundary.tsx
import React, { Component, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card shadow-lg border-0"
            style={{ maxWidth: 500, borderRadius: 16 }}
          >
            <div className="card-body p-5 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                style={{ fontSize: "4rem" }}
                className="mb-3"
              >
                ⚠️
              </motion.div>

              <h4 className="mb-2" style={{ color: "#2d3748" }}>
                Oops! Something went wrong
              </h4>

              <p className="text-muted mb-4">
                The application encountered an unexpected error. 
                Please try refreshing the page.
              </p>

              {this.state.error && (
                <div 
                  className="alert alert-danger text-start mb-4"
                  style={{ fontSize: "0.85rem" }}
                >
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}

              <div className="d-flex gap-2 justify-content-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary"
                  onClick={this.handleReset}
                >
                  🔄 Reload Page
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-secondary"
                  onClick={() => window.history.back()}
                >
                  ← Go Back
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
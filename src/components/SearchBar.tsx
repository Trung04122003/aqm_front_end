// src/components/SearchBar.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";

type Props = {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
};

export default function SearchBar({ 
  placeholder = "Search locations, sensors...",
  onSearch,
  suggestions = []
}: Props) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onSearch("");
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="position-relative" style={{ width: "100%", maxWidth: 400 }}>
      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ borderRadius: 12, overflow: "hidden" }}>
          <span className="input-group-text bg-light border-0">
            <FaSearch className="text-muted" size={14} />
          </span>

          <input
            type="text"
            className="form-control bg-light border-0 ps-2"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            style={{ fontSize: "0.9rem" }}
          />

          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                type="button"
                className="btn bg-light border-0"
                onClick={handleClear}
              >
                <FaTimes className="text-muted" size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="position-absolute w-100 mt-2 card border-0 shadow-lg"
            style={{ 
              zIndex: 1000,
              borderRadius: 12,
              overflow: "hidden"
            }}
          >
            <ul className="list-group list-group-flush">
              {filteredSuggestions.map((suggestion, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ backgroundColor: "#f8f9fa" }}
                  className="list-group-item list-group-item-action border-0"
                  style={{ cursor: "pointer", fontSize: "0.9rem" }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <FaSearch size={12} className="text-muted me-2" />
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
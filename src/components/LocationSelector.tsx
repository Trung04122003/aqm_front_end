// src/components/LocationSelector.tsx - ENHANCED FOR 63 PROVINCES 🇻🇳
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useState, useMemo } from "react";

type Location = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  locations: Location[];
  selected: number | null;
  onChange: (id: number) => void;
  loading?: boolean;
};

export default function LocationSelector({
  locations,
  selected,
  onChange,
  loading,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Helper: Determine region by province name
  const getRegion = (name: string): "north" | "central" | "south" => {
    const northernProvinces = [
      "Ha Noi",
      "Hai Phong",
      "Quang Ninh",
      "Bac Ninh",
      "Hai Duong",
      "Hung Yen",
      "Vinh Phuc",
      "Thai Nguyen",
      "Bac Giang",
      "Lang Son",
      "Cao Bang",
      "Ha Giang",
      "Tuyen Quang",
      "Phu Tho",
      "Lao Cai",
      "Yen Bai",
      "Lai Chau",
      "Dien Bien",
      "Son La",
      "Hoa Binh",
      "Ninh Binh",
      "Nam Dinh",
      "Thai Binh",
      "Ha Nam",
    ];

    const centralProvinces = [
      "Thanh Hoa",
      "Nghe An",
      "Ha Tinh",
      "Quang Binh",
      "Quang Tri",
      "Thua Thien Hue",
      "Da Nang",
      "Quang Nam",
      "Quang Ngai",
      "Binh Dinh",
      "Phu Yen",
      "Khanh Hoa",
      "Ninh Thuan",
      "Binh Thuan",
      "Kon Tum",
      "Gia Lai",
      "Dak Lak",
      "Dak Nong",
      "Lam Dong",
    ];

    if (northernProvinces.some((p) => name.includes(p))) return "north";
    if (centralProvinces.some((p) => name.includes(p))) return "central";
    return "south";
  };

  // ✅ Filter locations by search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery) return locations;

    const query = searchQuery.toLowerCase().trim();
    return locations.filter((loc) => loc.name.toLowerCase().includes(query));
  }, [locations, searchQuery]);

  // ✅ Group locations by region
  const groupedLocations = useMemo(() => {
    const groups = {
      north: [] as Location[],
      central: [] as Location[],
      south: [] as Location[],
    };

    filteredLocations.forEach((loc) => {
      const region = getRegion(loc.name);
      groups[region].push(loc);
    });

    return groups;
  }, [filteredLocations]);

  const selectedLocation = locations.find((l) => l.id === selected);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div
        className="card border-0 shadow-lg"
        style={{ borderRadius: 20, border: "3px solid #FFD700" }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: "2rem" }}
            >
              🗺️
            </motion.div>
            <div className="flex-grow-1">
              <h5 className="mb-1 fw-bold" style={{ color: "#C41E3A" }}>
                🇻🇳 Select Location
              </h5>
              <p className="mb-0 small text-muted">
                {locations.length} provinces available
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="position-relative mb-3">
            <FaSearch
              className="position-absolute"
              style={{
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
              }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="🔍 Search province... (e.g., Hanoi, Da Nang)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              style={{
                borderRadius: 12,
                border: "2px solid #FFD700",
                padding: "12px 12px 12px 45px",
              }}
            />
          </div>

          {/* Selected Location Display */}
          {selectedLocation && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="d-flex align-items-center gap-3 p-3 rounded-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(196, 30, 58, 0.1), rgba(22, 91, 51, 0.1))",
                border: "2px solid #165B33",
              }}
            >
              <FaMapMarkerAlt size={24} style={{ color: "#C41E3A" }} />
              <div className="flex-grow-1">
                <div className="fw-bold" style={{ color: "#165B33" }}>
                  {selectedLocation.name}
                </div>
                {selectedLocation.latitude && selectedLocation.longitude && (
                  <div className="small text-muted">
                    📍 {selectedLocation.latitude.toFixed(4)},{" "}
                    {selectedLocation.longitude.toFixed(4)}
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm btn-outline-success"
                onClick={() => setIsOpen(true)}
                style={{ borderRadius: 8 }}
              >
                Change
              </motion.button>
            </motion.div>
          )}

          {/* Dropdown List */}
          {(isOpen || !selectedLocation) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                maxHeight: 400,
                overflowY: "auto",
                border: "2px solid #FFD700",
                borderRadius: 12,
                background: "white",
              }}
            >
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading provinces...</p>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: "3rem" }}>🔍</div>
                  <p className="text-muted">
                    No provinces found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <>
                  {/* North Region */}
                  {groupedLocations.north.length > 0 && (
                    <div className="p-3 border-bottom">
                      <div className="fw-bold text-muted small mb-2">
                        🏔️ NORTHERN VIETNAM ({groupedLocations.north.length})
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {groupedLocations.north.map((loc) => (
                          <LocationButton
                            key={loc.id}
                            location={loc}
                            isSelected={loc.id === selected}
                            onClick={() => {
                              onChange(loc.id);
                              setIsOpen(false);
                              setSearchQuery("");
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Central Region */}
                  {groupedLocations.central.length > 0 && (
                    <div className="p-3 border-bottom">
                      <div className="fw-bold text-muted small mb-2">
                        🏖️ CENTRAL VIETNAM ({groupedLocations.central.length})
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {groupedLocations.central.map((loc) => (
                          <LocationButton
                            key={loc.id}
                            location={loc}
                            isSelected={loc.id === selected}
                            onClick={() => {
                              onChange(loc.id);
                              setIsOpen(false);
                              setSearchQuery("");
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* South Region */}
                  {groupedLocations.south.length > 0 && (
                    <div className="p-3">
                      <div className="fw-bold text-muted small mb-2">
                        🌴 SOUTHERN VIETNAM ({groupedLocations.south.length})
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {groupedLocations.south.map((loc) => (
                          <LocationButton
                            key={loc.id}
                            location={loc}
                            isSelected={loc.id === selected}
                            onClick={() => {
                              onChange(loc.id);
                              setIsOpen(false);
                              setSearchQuery("");
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ✅ Location Button Component
function LocationButton({
  location,
  isSelected,
  onClick,
}: {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn btn-sm"
      onClick={onClick}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, #C41E3A, #165B33)"
          : "white",
        color: isSelected ? "white" : "#165B33",
        border: isSelected ? "none" : "2px solid #165B33",
        borderRadius: 8,
        padding: "6px 12px",
        fontWeight: "600",
        fontSize: "0.85rem",
      }}
    >
      {isSelected && "✓ "}
      {location.name}
    </motion.button>
  );
}

// ✅ Helper: Determine region by province name
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRegion = (name: string): "north" | "central" | "south" => {
  const northernProvinces = [
    "Ha Noi",
    "Hai Phong",
    "Quang Ninh",
    "Bac Ninh",
    "Hai Duong",
    "Hung Yen",
    "Vinh Phuc",
    "Thai Nguyen",
    "Bac Giang",
    "Lang Son",
    "Cao Bang",
    "Ha Giang",
    "Tuyen Quang",
    "Phu Tho",
    "Lao Cai",
    "Yen Bai",
    "Lai Chau",
    "Dien Bien",
    "Son La",
    "Hoa Binh",
    "Ninh Binh",
    "Nam Dinh",
    "Thai Binh",
    "Ha Nam",
  ];

  const centralProvinces = [
    "Thanh Hoa",
    "Nghe An",
    "Ha Tinh",
    "Quang Binh",
    "Quang Tri",
    "Thua Thien Hue",
    "Da Nang",
    "Quang Nam",
    "Quang Ngai",
    "Binh Dinh",
    "Phu Yen",
    "Khanh Hoa",
    "Ninh Thuan",
    "Binh Thuan",
    "Kon Tum",
    "Gia Lai",
    "Dak Lak",
    "Dak Nong",
    "Lam Dong",
  ];

  if (northernProvinces.some((p) => name.includes(p))) return "north";
  if (centralProvinces.some((p) => name.includes(p))) return "central";
  return "south";
};

// ✅ Helper: Remove Vietnamese tones for search
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

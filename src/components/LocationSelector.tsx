// src/components/LocationSelector.tsx (NEW COMPONENT)
import { FaMapMarkerAlt } from "react-icons/fa";

type Location = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  locations: Location[];
  selected: number | null;
  onChange: (locationId: number) => void;
  loading?: boolean;
};

export default function LocationSelector({ locations, selected, onChange, loading }: Props) {
  // ✅ Vietnam city icons mapping
  const getCityIcon = (cityName: string) => {
    const icons: Record<string, string> = {
      "Ha Noi": "🏛️",
      "Ho Chi Minh City": "🏙️",
      "Da Nang": "🌊",
      "Hai Phong": "⚓",
      "Can Tho": "🌾",
      "Hue": "🏰"
    };
    return icons[cityName] || "📍";
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="card-body p-3 text-center">
          <div className="spinner-border spinner-border-sm text-primary" />
          <span className="ms-2">Loading locations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3">
          <FaMapMarkerAlt className="text-primary" size={20} />
          <select
            className="form-select border-0 bg-light flex-grow-1"
            style={{ borderRadius: 12, fontSize: "1rem" }}
            value={selected ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
          >
            {locations.length === 0 && (
              <option value="">No locations available</option>
            )}
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {getCityIcon(loc.name)} {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ✅ Usage Example in Dashboard:
/*
import LocationSelector from "../components/LocationSelector";

// In Dashboard component:
<LocationSelector
  locations={locations}
  selected={selected}
  onChange={setSelected}
  loading={loadingLocations}
/>
*/
// src/components/WeatherCard.tsx
import { motion } from "framer-motion";
import { 
  WiThermometer, 
  WiHumidity, 
  WiStrongWind, 
  WiBarometer,
  WiRaindrop 
} from "react-icons/wi";

type Props = {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  pressure?: number;
  precipProbability?: number;
  locationName?: string;
};

export default function WeatherCard({
  temperature,
  humidity,
  windSpeed,
  windDirection,
  pressure,
  precipProbability,
  locationName
}: Props) {
  
  const getWindDirection = (deg?: number) => {
    if (deg === undefined) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card card-aqm p-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="text-muted small">Weather Conditions</div>
          {locationName && (
            <div className="fw-semibold">{locationName}</div>
          )}
        </div>
        <div style={{ fontSize: "2.5rem" }}>🌤️</div>
      </div>

      <div className="row g-3">
        {/* Temperature */}
        <div className="col-6">
          <div className="d-flex align-items-center gap-2">
            <WiThermometer size={32} className="text-danger" />
            <div>
              <div className="h4 mb-0">
                {temperature !== undefined ? `${temperature.toFixed(1)}°C` : "—"}
              </div>
              <div className="text-muted small">Temperature</div>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="col-6">
          <div className="d-flex align-items-center gap-2">
            <WiHumidity size={32} className="text-info" />
            <div>
              <div className="h4 mb-0">
                {humidity !== undefined ? `${humidity.toFixed(0)}%` : "—"}
              </div>
              <div className="text-muted small">Humidity</div>
            </div>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="col-6">
          <div className="d-flex align-items-center gap-2">
            <WiStrongWind size={32} className="text-primary" />
            <div>
              <div className="h4 mb-0">
                {windSpeed !== undefined 
                  ? `${windSpeed.toFixed(1)} m/s` 
                  : "—"}
              </div>
              <div className="text-muted small">
                Wind {getWindDirection(windDirection)}
              </div>
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="col-6">
          <div className="d-flex align-items-center gap-2">
            <WiBarometer size={32} className="text-secondary" />
            <div>
              <div className="h4 mb-0">
                {pressure !== undefined ? `${pressure.toFixed(0)} hPa` : "—"}
              </div>
              <div className="text-muted small">Pressure</div>
            </div>
          </div>
        </div>

        {/* Precipitation Probability */}
        {precipProbability !== undefined && (
          <div className="col-12">
            <div className="d-flex align-items-center gap-2">
              <WiRaindrop size={32} className="text-primary" />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted">Rain Chance</span>
                  <span className="fw-semibold">{precipProbability.toFixed(0)}%</span>
                </div>
                <div className="progress mt-1" style={{ height: 6 }}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${precipProbability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
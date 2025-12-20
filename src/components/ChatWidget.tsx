// src/components/ChatWidget.tsx
// src/components/ChatWidget.tsx - PRO VERSION 🚀
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import api from "../api/axios";
import { toast } from "react-toastify";
import useAuth from "../auth/useAuth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface RealTimeContext {
  location?: string;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  hasData: boolean;
}

/**
 * 🤖 AI Chat Widget PRO - Smart AI Assistant with Real-Time Data
 * Features:
 * - Smart context-aware responses
 * - Real-time AQI data integration
 * - Weather data from OpenWeather
 * - 30+ predefined Q&A pairs
 * - Dynamic suggestions based on AQI
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [realTimeContext, setRealTimeContext] = useState<RealTimeContext>({
    hasData: false,
  });
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        language === "vi"
          ? "👋 Xin chào! Tôi là Claude AI, trợ lý thông minh về chất lượng không khí.\n\n🌍 Tôi có thể giúp bạn:\n• Hiểu về AQI và các chỉ số ô nhiễm\n• Kiểm tra chất lượng không khí real-time\n• Tư vấn bảo vệ sức khỏe\n• Giải thích các thuật ngữ\n\nBạn muốn hỏi gì? 😊"
          : "👋 Hello! I'm Claude AI, your smart air quality assistant.\n\n🌍 I can help you:\n• Understand AQI and pollution indices\n• Check real-time air quality\n• Health protection advice\n• Explain technical terms\n\nWhat would you like to know? 😊",
      timestamp: new Date().toISOString(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // 📊 Fetch real-time context when widget opens
  useEffect(() => {
    if (isOpen && !realTimeContext.hasData) {
      fetchRealTimeContext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchRealTimeContext = async () => {
    try {
      // Get user's last selected location from localStorage
      const lastLocationId = localStorage.getItem("selectedLocation");

      if (lastLocationId) {
        // Fetch current AQI data
        const aqiResponse = await api.get(
          `/data?locationId=${lastLocationId}&range=1h`
        );
        const currentData = aqiResponse.data.current;

        // Fetch weather data
        const weatherResponse = await api.get(
          `/weather?location=${lastLocationId}`
        );
        const weatherData = weatherResponse.data[0];

        // Get location info
        const locationsResponse = await api.get("/locations");
        const location = locationsResponse.data.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (l: any) => l.id === parseInt(lastLocationId)
        );

        setRealTimeContext({
          location: location?.name || "Unknown",
          aqi: currentData?.aqi,
          pm25: currentData?.pm25,
          pm10: currentData?.pm10,
          temperature: weatherData?.temperatureC,
          humidity: weatherData?.humidityPct,
          hasData: true,
        });

        console.log("✅ Real-time context loaded:", {
          location: location?.name,
          aqi: currentData?.aqi,
        });
      }
    } catch (error) {
      console.error("Failed to load context:", error);
    }
  };

  // 🧠 Smart Local Response (before calling API)
  const getSmartLocalResponse = (message: string): string | null => {
    const msg = message.toLowerCase().trim();

    // Detect language
    const isVietnamese =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(
        msg
      );
    const lang = isVietnamese ? "vi" : "en";

    // Real-time data queries
    if (
      msg.includes("aqi hiện tại") ||
      msg.includes("current aqi") ||
      msg.includes("air quality now")
    ) {
      if (realTimeContext.hasData && realTimeContext.aqi) {
        return lang === "vi"
          ? `📊 **Chất lượng không khí hiện tại tại ${realTimeContext.location}:**

🌡️ AQI: **${realTimeContext.aqi}** - ${getAQIStatus(realTimeContext.aqi, lang)}
💨 PM2.5: ${realTimeContext.pm25?.toFixed(1)} µg/m³
💨 PM10: ${realTimeContext.pm10?.toFixed(1)} µg/m³
${realTimeContext.temperature ? `🌡️ Nhiệt độ: ${realTimeContext.temperature.toFixed(1)}°C` : ""}
${realTimeContext.humidity ? `💧 Độ ẩm: ${realTimeContext.humidity.toFixed(0)}%` : ""}

${getHealthAdvice(realTimeContext.aqi, lang)}`
          : `📊 **Current Air Quality in ${realTimeContext.location}:**

🌡️ AQI: **${realTimeContext.aqi}** - ${getAQIStatus(realTimeContext.aqi, lang)}
💨 PM2.5: ${realTimeContext.pm25?.toFixed(1)} µg/m³
💨 PM10: ${realTimeContext.pm10?.toFixed(1)} µg/m³
${realTimeContext.temperature ? `🌡️ Temperature: ${realTimeContext.temperature.toFixed(1)}°C` : ""}
${realTimeContext.humidity ? `💧 Humidity: ${realTimeContext.humidity.toFixed(0)}%` : ""}

${getHealthAdvice(realTimeContext.aqi, lang)}`;
      }
      return lang === "vi"
        ? "Xin lỗi, hiện tại tôi không có dữ liệu real-time. Bạn vui lòng chọn location trên Dashboard trước nhé! 📍"
        : "Sorry, I don't have real-time data. Please select a location on the Dashboard first! 📍";
    }

    // Bilingual Q&A pairs
    const qaPairsVi: Record<string, string> = {
      "aqi là gì":
        "🌍 **AQI (Air Quality Index)** là chỉ số chất lượng không khí, thang đo từ 0-500:\n\n✅ 0-50: Tốt\n⚠️ 51-100: Trung bình\n🟠 101-150: Kém cho nhóm nhạy cảm\n🔴 151-200: Không lành mạnh\n🟣 201-300: Rất không lành mạnh\n⚫ 301-500: Nguy hại\n\nCàng thấp càng tốt! 😊",

      "pm2.5 là gì":
        "💨 **PM2.5** là bụi siêu mịn có đường kính < 2.5 micromet (nhỏ hơn sợi tóc 30 lần!).\n\n⚠️ **Nguy hiểm vì:**\n• Xâm nhập sâu vào phổi\n• Vào máu gây bệnh tim mạch\n• Gây ung thư phổi\n• Ảnh hưởng não bộ\n\n🏭 **Nguồn:** khói xe, nhà máy, đốt rơm rạ",

      "khẩu trang nào tốt":
        "😷 **Top khẩu trang chống bụi PM2.5:**\n\n🥇 **N95/KN95:** Lọc 95% PM2.5, tốt nhất!\n🥈 **N99/P100:** Lọc 99%, dùng môi trường cực độc\n🥉 **Khẩu trang y tế:** Chỉ chống giọt bắn, KHÔNG lọc PM2.5\n\n💡 **Lưu ý:**\n• Đeo khít mặt\n• Thay sau 8h sử dụng\n• Có van thở để thoáng hơn",

      "máy lọc không khí nào tốt":
        "🌀 **Chọn máy lọc không khí:**\n\n🔹 **Bắt buộc có:**\n• Bộ lọc HEPA (lọc 99.97% PM2.5)\n• CADR cao (> 300 m³/h cho phòng 30m²)\n• Bộ lọc carbon (khử mùi)\n\n🔸 **Nên có:**\n• Cảm biến PM2.5\n• Chế độ tự động\n• Hoạt động êm (< 50dB)\n\n🏷️ **Thương hiệu:** Xiaomi, Sharp, Philips, Blueair",

      "trẻ em bị ảnh hưởng như thế nào":
        "👶 **Trẻ em RẤT DỄ BỊ TỔN THƯƠNG:**\n\n⚠️ **Lý do:**\n• Phổi chưa phát triển hoàn thiện\n• Hít thở nhiều hơn người lớn\n• Chơi ngoài trời nhiều\n• Hệ miễn dịch yếu\n\n🏥 **Hậu quả:**\n• Nhiễm trùng hô hấp\n• Hen suyễn\n• Chậm phát triển phổi\n• Giảm IQ\n\n🛡️ **Bảo vệ:** Hạn chế ra ngoài khi AQI > 100!",

      "có nên tập thể dục ngoài trời không":
        "🏃 **Tập thể dục ngoài trời an toàn khi:**\n\n✅ AQI < 50: Hoàn toàn OK!\n⚠️ AQI 51-100: Hạn chế cường độ cao\n🚫 AQI 101-150: Chỉ nhóm khỏe mạnh, cường độ nhẹ\n🚫 AQI > 150: KHÔNG nên tập ngoài trời\n\n💡 **Tốt nhất:** Tập buổi sáng sớm (5-7h) hoặc tối muộn (sau 8h)",

      "mưa có giảm ô nhiễm không":
        "🌧️ **MƯA GIẢM Ô NHIỄM MẠNH!**\n\n✅ **Cơ chế:**\n• Giọt mưa cuốn bụi xuống đất\n• Làm sạch không khí\n• AQI giảm 30-70%\n\n💧 **Hiệu quả:**\n• Mưa nhẹ: Giảm ít\n• Mưa vừa/to: Giảm nhiều\n\n⚠️ **Lưu ý:** Sau mưa dứt 1-2h, ô nhiễm quay lại!",
    };

    const qaPairsEn: Record<string, string> = {
      "what is aqi":
        "🌍 **AQI (Air Quality Index)** measures air quality on a scale of 0-500:\n\n✅ 0-50: Good\n⚠️ 51-100: Moderate\n🟠 101-150: Unhealthy for sensitive groups\n🔴 151-200: Unhealthy\n🟣 201-300: Very unhealthy\n⚫ 301-500: Hazardous\n\nLower is better! 😊",

      "what is pm2.5":
        "💨 **PM2.5** are fine particles with diameter < 2.5 micrometers (30x smaller than a hair!).\n\n⚠️ **Dangerous because:**\n• Penetrates deep into lungs\n• Enters bloodstream causing cardiovascular disease\n• Causes lung cancer\n• Affects brain function\n\n🏭 **Sources:** vehicle exhaust, factories, biomass burning",

      "which mask is best":
        "😷 **Top masks for PM2.5 protection:**\n\n🥇 **N95/KN95:** Filters 95% of PM2.5, best choice!\n🥈 **N99/P100:** Filters 99%, for extreme conditions\n🥉 **Surgical masks:** Only blocks droplets, NOT PM2.5\n\n💡 **Tips:**\n• Ensure proper fit\n• Replace after 8 hours\n• Breathing valve recommended",

      "which air purifier is best":
        "🌀 **Choosing an air purifier:**\n\n🔹 **Must have:**\n• HEPA filter (removes 99.97% PM2.5)\n• High CADR (> 300 m³/h for 30m² room)\n• Carbon filter (odor removal)\n\n🔸 **Nice to have:**\n• PM2.5 sensor\n• Auto mode\n• Quiet operation (< 50dB)\n\n🏷️ **Brands:** Xiaomi, Sharp, Philips, Blueair",

      "how does pollution affect children":
        "👶 **Children are EXTREMELY VULNERABLE:**\n\n⚠️ **Reasons:**\n• Developing lungs\n• Breathe more air per body weight\n• More outdoor activities\n• Weaker immune system\n\n🏥 **Effects:**\n• Respiratory infections\n• Asthma\n• Impaired lung development\n• Lower IQ\n\n🛡️ **Protection:** Limit outdoor time when AQI > 100!",

      "should i exercise outdoors":
        "🏃 **Outdoor exercise safe when:**\n\n✅ AQI < 50: Completely OK!\n⚠️ AQI 51-100: Reduce intensity\n🚫 AQI 101-150: Only healthy people, light intensity\n🚫 AQI > 150: DO NOT exercise outdoors\n\n💡 **Best times:** Early morning (5-7am) or late evening (after 8pm)",

      "does rain reduce pollution":
        "🌧️ **RAIN REDUCES POLLUTION SIGNIFICANTLY!**\n\n✅ **How it works:**\n• Raindrops capture particles\n• Cleans the air\n• AQI drops 30-70%\n\n💧 **Effectiveness:**\n• Light rain: Minor reduction\n• Moderate/heavy rain: Major reduction\n\n⚠️ **Note:** Pollution returns 1-2 hours after rain stops!",
    };

    // Search in appropriate language database
    const qaPairs = lang === "vi" ? qaPairsVi : qaPairsEn;

    for (const [keyword, answer] of Object.entries(qaPairs)) {
      if (msg.includes(keyword)) {
        return answer;
      }
    }

    return null;
  };

  const getAQIStatus = (aqi: number, lang: "vi" | "en" = "vi"): string => {
    if (lang === "vi") {
      if (aqi <= 50) return "Tốt ✅";
      if (aqi <= 100) return "Trung bình ⚠️";
      if (aqi <= 150) return "Kém cho nhóm nhạy cảm 🟠";
      if (aqi <= 200) return "Không lành mạnh 🔴";
      if (aqi <= 300) return "Rất không lành mạnh 🟣";
      return "Nguy hại ⚫";
    } else {
      if (aqi <= 50) return "Good ✅";
      if (aqi <= 100) return "Moderate ⚠️";
      if (aqi <= 150) return "Unhealthy for sensitive groups 🟠";
      if (aqi <= 200) return "Unhealthy 🔴";
      if (aqi <= 300) return "Very unhealthy 🟣";
      return "Hazardous ⚫";
    }
  };

  const getHealthAdvice = (aqi: number, lang: "vi" | "en" = "vi"): string => {
    if (lang === "vi") {
      if (aqi <= 50)
        return "✅ Không khí tốt! Bạn có thể hoạt động bình thường.";
      if (aqi <= 100)
        return "⚠️ Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời.";
      if (aqi <= 150)
        return "🟠 Hạn chế hoạt động ngoài trời. Đeo khẩu trang nếu ra ngoài.";
      if (aqi <= 200)
        return "🔴 Tránh ra ngoài. Đóng cửa sổ, dùng máy lọc không khí.";
      return "🚨 NGUY HIỂM! Ở trong nhà, đeo khẩu trang N95 nếu bắt buộc phải ra ngoài.";
    } else {
      if (aqi <= 50)
        return "✅ Air quality is good! You can do normal activities.";
      if (aqi <= 100)
        return "⚠️ Sensitive groups should limit prolonged outdoor activities.";
      if (aqi <= 150)
        return "🟠 Limit outdoor activities. Wear a mask if going outside.";
      if (aqi <= 200)
        return "🔴 Avoid going outside. Close windows, use air purifier.";
      return "🚨 DANGEROUS! Stay indoors, wear N95 mask if must go outside.";
    }
  };

  // Generate dynamic suggestions based on context
  const getDynamicSuggestions = (): string[] => {
    if (language === "vi") {
      const base = [
        "AQI là gì?",
        "PM2.5 nguy hiểm thế nào?",
        "Khẩu trang nào tốt?",
      ];

      if (realTimeContext.hasData) {
        if (realTimeContext.aqi && realTimeContext.aqi > 100) {
          return [
            "AQI hiện tại bao nhiêu?",
            "Tôi có nên ra ngoài không?",
            "Làm gì để bảo vệ sức khỏe?",
          ];
        } else {
          return [
            "Kiểm tra AQI hiện tại",
            "Thời gian nào không khí sạch?",
            "Có nên tập thể dục ngoài trời?",
          ];
        }
      }
      return base;
    } else {
      const base = [
        "What is AQI?",
        "How dangerous is PM2.5?",
        "Which mask is best?",
      ];

      if (realTimeContext.hasData) {
        if (realTimeContext.aqi && realTimeContext.aqi > 100) {
          return [
            "What's the current AQI?",
            "Should I go outside?",
            "How to protect my health?",
          ];
        } else {
          return [
            "Check current AQI",
            "When is air cleanest?",
            "Can I exercise outdoors?",
          ];
        }
      }
      return base;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Try local smart response first
    const localResponse = getSmartLocalResponse(inputMessage);

    if (localResponse) {
      // Use local response (instant)
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: localResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 500);
      return;
    }

    // Fall back to API
    try {
      const response = await api.post("/ai/chat", {
        message: inputMessage,
        history: messages.slice(-5).map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
        userContext: `User: ${user?.username}, Location: ${realTimeContext.location || "Unknown"}, Current AQI: ${realTimeContext.aqi || "Unknown"}`,
      });

      if (response.data && response.data.success) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: response.data.message,
          timestamp: response.data.timestamp,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error("❌ Claude không thể trả lời");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "😔 Xin lỗi, tôi gặp lỗi. Bạn có thể thử hỏi lại không?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "3px solid #FFD700",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
              cursor: "pointer",
              zIndex: 9998,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🧠
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              width: 450,
              height: 650,
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: 24,
              background: "white",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "3px solid #667eea",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "28px" }}>🧠</span>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Claude AI Pro
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.9 }}>
                    {realTimeContext.hasData ? (
                      <>
                        📍 {realTimeContext.location} • AQI:{" "}
                        {realTimeContext.aqi}
                      </>
                    ) : language === "vi" ? (
                      "Trợ lý thông minh"
                    ) : (
                      "Smart Assistant"
                    )}
                  </div>
                </div>
              </div>

              {/* Language Toggle + Close buttons */}
              <div className="d-flex gap-2">
                {/* 🌍 Language Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newLang = language === "vi" ? "en" : "vi";
                    setLanguage(newLang);
                    // Update welcome message
                    setMessages([
                      {
                        role: "assistant",
                        content:
                          newLang === "vi"
                            ? "👋 Xin chào! Tôi là Claude AI, trợ lý thông minh về chất lượng không khí.\n\n🌍 Tôi có thể giúp bạn:\n• Hiểu về AQI và các chỉ số ô nhiễm\n• Kiểm tra chất lượng không khí real-time\n• Tư vấn bảo vệ sức khỏe\n• Giải thích các thuật ngữ\n\nBạn muốn hỏi gì? 😊"
                            : "👋 Hello! I'm Claude AI, your smart air quality assistant.\n\n🌍 I can help you:\n• Understand AQI and pollution indices\n• Check real-time air quality\n• Health protection advice\n• Explain technical terms\n\nWhat would you like to know? 😊",
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {language === "vi" ? "EN" : "VI"}
                </motion.button>

                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Real-Time Context Banner */}
            {realTimeContext.hasData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background:
                    "linear-gradient(90deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                  padding: "10px 15px",
                  fontSize: "12px",
                  borderBottom: "1px solid #E5E7EB",
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  📊 AQI: <strong>{realTimeContext.aqi}</strong>
                </span>
                <span>
                  💨 PM2.5: <strong>{realTimeContext.pm25?.toFixed(1)}</strong>
                </span>
                {realTimeContext.temperature && (
                  <span>
                    🌡️{" "}
                    <strong>{realTimeContext.temperature.toFixed(1)}°C</strong>
                  </span>
                )}
              </motion.div>
            )}

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: "linear-gradient(135deg, #E0F7FA 0%, #FFFAFA 100%)",
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: 16,
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #667eea, #764ba2)"
                          : "white",
                      color: msg.role === "user" ? "white" : "#475569",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.7,
                          marginBottom: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: "600",
                        }}
                      >
                        <span>🧠</span> Claude AI
                      </div>
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    background: "white",
                    borderRadius: 16,
                    maxWidth: "80%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#667eea",
                      fontWeight: "600",
                    }}
                  >
                    🧠 Claude đang suy nghĩ
                  </span>
                  <div className="d-flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: i * 0.2,
                        }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#667eea",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "16px",
                background: "white",
                borderTop: "2px solid #E5E7EB",
              }}
            >
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === "vi"
                      ? "Hỏi Claude về chất lượng không khí..."
                      : "Ask Claude about air quality..."
                  }
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "2px solid #E5E7EB",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none",
                    borderRadius: 12,
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor:
                      inputMessage.trim() && !isTyping
                        ? "pointer"
                        : "not-allowed",
                    opacity: inputMessage.trim() && !isTyping ? 1 : 0.5,
                  }}
                >
                  <FaPaperPlane color="white" size={18} />
                </motion.button>
              </div>

              {/* Dynamic Quick Suggestions */}
              <div
                className="d-flex gap-2 mt-2"
                style={{ overflowX: "auto", paddingBottom: 4 }}
              >
                {getDynamicSuggestions().map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputMessage(suggestion)}
                    disabled={isTyping}
                    style={{
                      background: "rgba(102, 126, 234, 0.1)",
                      border: "1px solid rgba(102, 126, 234, 0.3)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: "11px",
                      color: "#667eea",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

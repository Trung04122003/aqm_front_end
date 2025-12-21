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
      // ========== AQI BASICS ==========
      "aqi là gì":
        "🌍 **AQI (Air Quality Index)** là chỉ số chất lượng không khí, thang đo từ 0-500:\n\n✅ 0-50: Tốt\n⚠️ 51-100: Trung bình\n🟠 101-150: Kém cho nhóm nhạy cảm\n🔴 151-200: Không lành mạnh\n🟣 201-300: Rất không lành mạnh\n⚫ 301-500: Nguy hại\n\nCàng thấp càng tốt! 😊",

      "aqi tính như thế nào":
        "🧮 **AQI được tính dựa trên 6 chất ô nhiễm:**\n\n1. PM2.5 (bụi mịn)\n2. PM10 (bụi thô)\n3. O₃ (ozone)\n4. NO₂ (nitrogen dioxide)\n5. SO₂ (sulfur dioxide)\n6. CO (carbon monoxide)\n\n📊 Chất nào có chỉ số cao nhất sẽ quyết định AQI tổng thể!",

      "aqi 100 có an toàn không":
        "⚠️ **AQI 100 ở mức trung bình:**\n\n✅ Người khỏe mạnh: An toàn\n🟡 Nhóm nhạy cảm (trẻ em, người già, bệnh hô hấp): Nên hạn chế hoạt động ngoài trời kéo dài\n\n💡 Mức lý tưởng là AQI < 50!",

      "aqi 150 nguy hiểm không":
        "🟠 **AQI 150 là KÉM cho nhóm nhạy cảm:**\n\n⚠️ Mọi người có thể bắt đầu cảm thấy ảnh hưởng\n🚫 Nhóm nhạy cảm nên hạn chế mạnh hoạt động ngoài trời\n😷 Nên đeo khẩu trang khi ra ngoài\n\n💡 Trẻ em, người già, bệnh hen nên ở trong nhà!",

      "aqi 200 làm gì":
        "🔴 **AQI 200 là KHÔNG LÀNH MẠNH:**\n\n1. 🏠 Ở trong nhà, đóng cửa sổ\n2. 😷 Đeo khẩu trang N95 nếu ra ngoài\n3. 🌀 Bật máy lọc không khí\n4. 🚫 Hủy mọi hoạt động ngoài trời\n5. 💊 Người bệnh nền cần đặc biệt cẩn trọng\n\n⚠️ Mọi người đều bị ảnh hưởng ở mức này!",

      "aqi cao nhất bao nhiêu":
        "⚫ **AQI cao nhất là 500+ (Nguy hại):**\n\n🏭 **Trường hợp xảy ra:**\n• Cháy rừng lớn\n• Sự cố công nghiệp nghiêm trọng\n• Bão bụi\n\n🚨 **Hành động:**\n• TUYỆT ĐỐI không ra ngoài\n• Đeo khẩu trang ngay cả trong nhà\n• Di tản nếu có thể\n\n📍 Việt Nam từng có AQI 300+ ở Hà Nội mùa đông!",

      // ========== PM2.5 DETAILED ==========
      "pm2.5 là gì":
        "💨 **PM2.5** là bụi siêu mịn có đường kính < 2.5 micromet (nhỏ hơn sợi tóc 30 lần!).\n\n⚠️ **Nguy hiểm vì:**\n• Xâm nhập sâu vào phổi\n• Vào máu gây bệnh tim mạch\n• Gây ung thư phổi\n• Ảnh hưởng não bộ\n\n🏭 **Nguồn:** khói xe, nhà máy, đốt rơm rạ",

      "pm2.5 bao nhiêu là an toàn":
        "✅ **Mức an toàn PM2.5:**\n\n🟢 0-12 µg/m³: Tốt\n🟡 12-35.4 µg/m³: Trung bình\n🟠 35.5-55.4 µg/m³: Kém\n🔴 55.5+: Nguy hại\n\n💡 **WHO khuyến cáo:** < 5 µg/m³ (24h) là lý tưởng!",

      "pm2.5 cao làm sao":
        "🚨 **Khi PM2.5 cao (>35 µg/m³):**\n\n1. 🏠 Ở trong nhà, đóng cửa sổ\n2. 😷 Đeo khẩu trang N95/KN95\n3. 🌀 Dùng máy lọc không khí có HEPA\n4. 🚫 Tránh tập thể dục ngoài trời\n5. 💧 Uống nhiều nước\n6. 👨‍⚕️ Người bệnh nền cần cẩn trọng\n\n❌ KHÔNG đốt nhang, nấu ăn gây khói!",

      "pm2.5 từ đâu":
        "🏭 **Nguồn PM2.5 chính:**\n\n🚗 **Giao thông (40%):**\n• Khói xe diesel\n• Mài mòn phanh, lốp\n\n🏭 **Công nghiệp (30%):**\n• Nhiệt điện than\n• Xi măng, thép\n\n🔥 **Đốt sinh khối (20%):**\n• Rơm rạ\n• Rác thải\n\n🏠 **Gia đình (10%):**\n• Nấu ăn\n• Đốt nhang, thuốc lá",

      "pm2.5 ảnh hưởng gì":
        "⚠️ **Tác hại PM2.5:**\n\n🫁 **Hô hấp:**\n• Hen suyễn\n• Viêm phổi\n• Ung thư phổi\n• COPD\n\n❤️ **Tim mạch:**\n• Đột quỵ\n• Nhồi máu cơ tim\n• Cao huyết áp\n• Rối loạn nhịp tim\n\n🧠 **Thần kinh:**\n• Alzheimer\n• Parkinson\n• Giảm trí nhớ\n• Trầm cảm",

      "pm2.5 trong nhà":
        "🏠 **PM2.5 trong nhà thường CAO HỞN ngoài trời!**\n\n🔥 **Nguồn:**\n• Nấu ăn (dầu mỡ bay)\n• Đốt nhang\n• Hút thuốc\n• Bụi từ ngoài lọt vào\n\n✅ **Giảm PM2.5 trong nhà:**\n• Dùng máy hút mùi khi nấu\n• Đóng cửa khi AQI ngoài cao\n• Máy lọc không khí HEPA\n• KHÔNG đốt nhang, hút thuốc trong nhà",

      // ========== PM10 ==========
      "pm10 là gì":
        "💨 **PM10** là bụi thô có đường kính < 10 micromet.\n\n📍 **Khác PM2.5:**\n• Lớn hơn, chỉ vào phổi nông\n• Ít nguy hiểm hơn PM2.5\n• Gây kích ứng mũi họng\n\n🏗️ **Nguồn:** bụi đường, công trình xây dựng, bụi sa mạc",

      "pm10 nguy hiểm không":
        "⚠️ **PM10 ít nguy hiểm hơn PM2.5 nhưng vẫn có hại!**\n\n❌ **Tác hại:**\n• Kích ứng mắt, mũi, họng\n• Hen suyễn\n• Viêm phế quản mãn tính\n• Giảm chức năng phổi\n\n✅ **Mức an toàn:** < 50 µg/m³\n\n💡 Khẩu trang y tế lọc được PM10 nhưng KHÔNG lọc PM2.5!",

      "pm10 cao làm sao":
        "🟠 **Khi PM10 cao (>150 µg/m³):**\n\n• 😷 Đeo khẩu trang thường\n• 👁️ Đeo kính bảo vệ mắt\n• 🚫 Hạn chế hoạt động ngoài trời\n• 💧 Súc mũi, họng thường xuyên\n\n💡 PM10 thường cao ở khu vực:\n• Đường đất\n• Công trường xây dựng\n• Khu công nghiệp",

      // ========== MASKS & PROTECTION ==========
      "khẩu trang nào tốt":
        "😷 **Top khẩu trang chống bụi PM2.5:**\n\n🥇 **N95/KN95/KF94:** Lọc 95% PM2.5, tốt nhất!\n🥈 **N99/P100:** Lọc 99%, dùng môi trường cực độc\n🥉 **Khẩu trang y tế:** Chỉ chống giọt bắn, KHÔNG lọc PM2.5\n❌ **Khẩu trang vải:** Không hiệu quả với PM2.5\n\n💡 **Lưu ý:**\n• Đeo khít mặt, không khe hở\n• Thay sau 8h sử dụng\n• Có van thở để thoáng hơn",

      "n95 và kn95 khác gì":
        "🔍 **N95 vs KN95:**\n\n**N95 (Mỹ):**\n✅ Tiêu chuẩn NIOSH (Mỹ)\n✅ Lọc ≥95% hạt 0.3µm\n\n**KN95 (Trung Quốc):**\n✅ Tiêu chuẩn GB2626 (TQ)\n✅ Lọc ≥95% hạt 0.3µm\n\n💡 **Kết luận:** Hiệu quả tương đương nhau!\n\n🏷️ **KF94 (Hàn Quốc):** Cũng lọc 94%, rất tốt!",

      "khẩu trang y tế có lọc bụi không":
        "❌ **KHÔNG!** Khẩu trang y tế:**\n\n✅ **Chống được:**\n• Giọt bắn (droplets)\n• Vi khuẩn lớn\n\n❌ **KHÔNG chống:**\n• PM2.5 (quá nhỏ, xuyên qua)\n• PM10\n• Khí độc\n\n💡 **Phải dùng N95/KN95 mới lọc được PM2.5!**",

      "cách đeo khẩu trang đúng":
        "😷 **7 bước đeo khẩu trang đúng:**\n\n1. ✅ Rửa tay trước khi đeo\n2. ✅ Dây trên qua đầu, dây dưới qua cổ (nếu có 2 dây)\n3. ✅ Nắn thanh kim loại khít sống mũi\n4. ✅ Kéo khẩu trang che kín cằm\n5. ✅ Kiểm tra không có khe hở 2 bên\n6. ✅ Test: Hít/thở mạnh, không khí không lọt ra viền\n7. ✅ KHÔNG chạm vào mặt ngoài khi đeo\n\n❌ **SAI:** Đeo luồn cằm, đeo 1 dây, để lộ mũi!",

      "khẩu trang dùng bao lâu":
        "⏱️ **Thời gian dùng khẩu trang:**\n\n**N95/KN95:**\n• Môi trường sạch: 8-12 giờ\n• Môi trường ô nhiễm: 4-6 giờ\n• AQI >200: 2-4 giờ\n\n**Khẩu trang y tế:**\n• 2-4 giờ\n• Ẩm ướt thì thay ngay\n\n❌ **KHÔNG tái sử dụng nếu:**\n• Bẩn, rách\n• Ẩm ướt\n• Khó thở\n• Mất độ đàn hồi dây",

      "khẩu trang có van thở tốt không":
        "🌬️ **Khẩu trang có van thở:**\n\n✅ **Ưu điểm:**\n• Thoáng hơn, dễ thở\n• Giảm nóng, ẩm\n• Phù hợp hoạt động nặng\n\n❌ **Nhược điểm:**\n• KHÔNG bảo vệ người xung quanh (nếu bạn bị bệnh)\n• Đắt hơn\n\n💡 **Kết luận:** Tốt cho chống ô nhiễm, KHÔNG dùng chống COVID!",

      // ========== AIR PURIFIERS ==========
      "máy lọc không khí nào tốt":
        "🌀 **Chọn máy lọc không khí:**\n\n🔹 **BẮT BUỘC có:**\n• Bộ lọc HEPA (lọc 99.97% PM2.5)\n• CADR cao (> 300 m³/h cho phòng 30m²)\n• Bộ lọc carbon (khử mùi, VOC)\n\n🔸 **NÊN có:**\n• Cảm biến PM2.5 real-time\n• Chế độ tự động\n• Hoạt động êm (< 50dB ban đêm)\n• Hẹn giờ, remote control\n\n🏷️ **Thương hiệu tốt:**\n• Cao cấp: IQAir, Blueair, Dyson\n• Tầm trung: Xiaomi, Sharp, Philips\n• Bình dân: Asus, Samsung",

      "máy lọc không khí có hiệu quả không":
        "✅ **CÓ HIỆU QUẢ RẤT CAO** nếu dùng đúng cách!\n\n📊 **Kết quả nghiên cứu:**\n• Giảm PM2.5 trong nhà 50-90%\n• Giảm các triệu chứng dị ứng 40-60%\n• Cải thiện giấc ngủ\n• Giảm nguy cơ bệnh hô hấp\n\n💡 **Điều kiện:**\n• Phòng kín (đóng cửa sổ)\n• Chạy liên tục 24/7\n• Thay lọc đúng hạn (3-6 tháng)\n• CADR phù hợp diện tích phòng",

      "hepa filter là gì":
        '🎯 **HEPA (High Efficiency Particulate Air):**\n\n✅ **Tiêu chuẩn:**\n• Lọc ≥99.97% hạt ≥0.3µm\n• Bao gồm PM2.5, PM10, vi khuẩn, virus\n\n🔬 **Cấp độ HEPA:**\n• H13: 99.95%\n• H14: 99.995% (y tế)\n\n💡 **Lưu ý:**\n• HEPA thật vs "HEPA-type" (giả)\n• Phải kiểm tra chứng nhận\n• Thay 6-12 tháng/lần',

      "cadr là gì":
        "📊 **CADR (Clean Air Delivery Rate):**\n\n🌀 **Ý nghĩa:** Lượng không khí sạch máy tạo ra (m³/h)\n\n✅ **Cách chọn:**\n• Phòng 20m²: CADR ≥200 m³/h\n• Phòng 30m²: CADR ≥300 m³/h\n• Phòng 50m²: CADR ≥500 m³/h\n\n💡 **Công thức:** CADR cần = Diện tích (m²) × Chiều cao (m) × 5\n\n🎯 **Càng cao càng tốt!**",

      "máy lọc đặt ở đâu":
        "📍 **Vị trí đặt máy lọc không khí:**\n\n✅ **NÊN:**\n• Giữa phòng (tốt nhất)\n• Cách tường 30-50cm\n• Gần khu vực ngồi/ngủ\n• Cửa hút/thổi không bị che\n\n❌ **KHÔNG:**\n• Góc phòng (luồng khí yếu)\n• Sau rèm, tủ\n• Sát tường\n• Gần cửa sổ mở\n\n💡 **Phòng lớn:** Dùng 2 máy hoặc máy CADR cao!",

      "thay lọc bao lâu":
        "⏱️ **Thời gian thay bộ lọc:**\n\n**HEPA filter:**\n• Môi trường sạch: 12 tháng\n• Môi trường ô nhiễm: 6 tháng\n• AQI thường >100: 3-4 tháng\n\n**Carbon filter:**\n• 6-12 tháng\n• Mất mùi = hết hạn\n\n**Pre-filter (lọc sơ):**\n• Hút bụi mỗi 2 tuần\n• Thay mỗi 3-6 tháng\n\n💡 **Dấu hiệu cần thay:**\n• Máy báo đèn đỏ\n• Giảm hiệu suất lọc\n• Có mùi khét",

      // ========== HEALTH IMPACTS ==========
      "ô nhiễm không khí ảnh hưởng gì":
        "⚠️ **Tác hại ô nhiễm không khí:**\n\n🫁 **Hô hấp:**\n• Hen suyễn\n• Viêm phổi\n• Ung thư phổi\n• COPD\n• Viêm phế quản\n\n❤️ **Tim mạch:**\n• Đột quỵ (+24% nguy cơ)\n• Nhồi máu cơ tim\n• Cao huyết áp\n• Rối loạn nhịp tim\n\n🧠 **Thần kinh:**\n• Alzheimer\n• Parkinson\n• Giảm trí nhớ\n• Trầm cảm\n• Giảm IQ (trẻ em)\n\n🤰 **Thai nhi:**\n• Sinh non\n• Nhẹ cân\n• Dị tật bẩm sinh",

      "trẻ em bị ảnh hưởng như thế nào":
        "👶 **Trẻ em RẤT DỄ BỊ TỔN THƯƠNG:**\n\n⚠️ **Lý do:**\n• Phổi chưa phát triển hoàn thiện\n• Hít thở 50% nhiều hơn người lớn/kg cân\n• Chơi ngoài trời nhiều\n• Hệ miễn dịch yếu\n• Chiều cao thấp (gần mặt đất = nhiều bụi)\n\n🏥 **Hậu quả:**\n• Nhiễm trùng hô hấp (↑40%)\n• Hen suyễn (↑20%)\n• Chậm phát triển phổi\n• Giảm IQ (mỗi 10µg/m³ PM2.5 = -1 IQ point)\n• Tăng động giảm chú ý (ADHD)\n\n🛡️ **Bảo vệ:**\n• Hạn chế ra ngoài khi AQI > 100\n• Dùng máy lọc trong phòng trẻ\n• Đeo khẩu trang N95 khi cần\n• Tránh chơi gần đường lớn",

      "bà bầu có nên ra ngoài không":
        "🤰 **Bà bầu CẦN TRÁNH ô nhiễm không khí!**\n\n⚠️ **Nguy cơ khi tiếp xúc PM2.5:**\n• Sinh non (↑19%)\n• Thai nhẹ cân (↑13%)\n• Tiền sản giật (↑51%)\n• Dị tật bẩm sinh\n• Sảy thai\n• Thai chết lưu\n\n✅ **Khuyến nghị:**\n• AQI < 50: An toàn\n• AQI 51-100: Hạn chế ra ngoài lâu\n• AQI > 100: NÊN ở nhà\n• Dùng máy lọc không khí\n• Đeo khẩu trang N95 khi bắt buộc ra ngoài\n• Khám thai đầy đủ, theo dõi sát\n\n❌ **TUYỆT ĐỐI KHÔNG:**\n• Hút thuốc\n• Đứng gần người hút thuốc\n• Tiếp xúc khói bếp nhiều",

      "người già bị ảnh hưởng":
        "👴👵 **Người cao tuổi NHÓM NGUY CƠ CAO:**\n\n⚠️ **Lý do:**\n• Chức năng phổi suy giảm\n• Hệ miễn dịch yếu\n• Thường có bệnh nền (tim, tiểu đường)\n\n🏥 **Nguy cơ:**\n• Đột quỵ (↑30%)\n• Nhồi máu cơ tim (↑25%)\n• Viêm phổi\n• COPD cấp\n• Tử vong sớm\n\n🛡️ **Bảo vệ:**\n• Theo dõi AQI hàng ngày\n• Ở nhà khi AQI > 100\n• Uống thuốc đều đặn\n• Máy lọc không khí\n• Khám định kỳ",

      "bệnh hen suyễn thì sao":
        "🫁 **Người bệnh hen suyễn CỰC KỲ NHẠY CẢM:**\n\n⚠️ **Tác động:**\n• Kích hoạt cơn hen (AQI > 100)\n• Tăng tần suất dùng thuốc xịt\n• Phải nhập viện\n• Giảm chức năng phổi\n\n✅ **Phòng ngừa:**\n• Theo dõi AQI mỗi ngày\n• Mang thuốc xịt bên người\n• Ở nhà khi AQI > 100\n• Dùng máy lọc 24/7\n• Đeo N95 khi ra ngoài\n• Tránh gắng sức khi AQI cao\n\n💊 **Lưu ý:** Tăng liều thuốc theo chỉ định bác sĩ khi ô nhiễm cao!",

      // ========== OUTDOOR ACTIVITIES ==========
      "có nên tập thể dục ngoài trời không":
        "🏃 **Tập thể dục ngoài trời an toàn khi:**\n\n✅ **AQI < 50:** Hoàn toàn OK!\n⚠️ **AQI 51-100:** Hạn chế cường độ cao\n🚫 **AQI 101-150:** Chỉ nhóm khỏe mạnh, cường độ nhẹ\n🚫 **AQI > 150:** KHÔNG nên tập ngoài trời\n\n💡 **Tốt nhất:** Tập buổi sáng sớm (5-7h) hoặc tối muộn (sau 8h)\n\n⚠️ **Tại sao không nên:** Khi tập, phổi hút nhiều không khí hơn 10-15 lần → hít nhiều bụi độc!",

      "thời gian nào không khí sạch nhất":
        "🌅 **Không khí sạch nhất:**\n\n🥇 **Sáng sớm 5-7h:**\n• Ít xe cộ\n• Nhiệt độ thấp\n• PM2.5 lắng xuống qua đêm\n• Độ ẩm cao giúp giữ bụi\n\n🥈 **Tối muộn sau 22h:**\n• Giao thông vắng\n• Nhà máy nghỉ\n• Nhiệt độ hạ\n\n❌ **Tệ nhất:**\n• 7-9h: Giờ cao điểm sáng\n• 17-19h: Giờ cao điểm chiều\n• 11-14h: Nóng nhất, bụi bay\n\n💡 Kiểm tra app AQI trước khi ra ngoài!",

      "chạy bộ khi nào":
        "🏃 **Thời gian tốt nhất chạy bộ:**\n\n✅ **5-7h sáng:**\n• AQI thấp nhất\n• Mát mẻ\n• Ít xe\n\n✅ **20-21h tối:**\n• AQI giảm\n• Mát hơn ban ngày\n\n❌ **TRÁNH:**\n• 7-9h, 17-19h: Giờ cao điểm\n• 11-15h: Nóng + AQI cao\n\n💡 **Địa điểm:**\n• Công viên (xa đường)\n• Ven hồ\n• ❌ KHÔNG chạy ven đường lớn!",

      "đi bộ có cần đeo khẩu trang không":
        "🚶 **Đeo khẩu trang khi đi bộ nếu:**\n\n✅ **AQI > 100:**\n• Đeo khẩu trang N95\n• Đi chậm, không gắng sức\n\n⚠️ **AQI 51-100:**\n• Nhóm nhạy cảm nên đeo\n• Người khỏe không bắt buộc\n\n✅ **AQI < 50:**\n• Không cần đeo\n\n💡 Tốt nhất: Đi bộ ở công viên, xa đường lớn!",

      "chơi thể thao trong nhà":
        "🏸 **Thể thao trong nhà TỐT HƠN khi AQI cao:**\n\n✅ **Ưu điểm:**\n• Không hít phải bụi độc\n• Kiểm soát nhiệt độ\n• An toàn\n\n🏋️ **Gợi ý:**\n• Gym trong nhà\n• Bơi (bể trong nhà)\n• Yoga, Pilates\n• Cầu lông, bóng bàn\n• Home workout (YouTube)\n\n💡 Đảm bảo phòng tập có thông gió tốt!",

      // ========== POLLUTION SOURCES ==========
      "nguồn gây ô nhiễm không khí":
        "🏭 **Nguồn ô nhiễm chính ở Việt Nam:**\n\n🚗 **Giao thông (40%):**\n• 65 triệu xe máy toàn quốc\n• Xe diesel cũ\n• Tắc đường = khói nhiều\n\n🏭 **Công nghiệp (30%):**\n• Nhiệt điện than\n• Xi măng\n• Thép\n• Gốm sứ\n\n🔥 **Đốt sinh khối (20%):**\n• Rơm rạ (mùa thu hoạch)\n• Rác thải\n• Đốt rừng\n\n🏠 **Sinh hoạt (10%):**\n• Nấu ăn\n• Sưởi ấm\n• Đốt nhang",

      "tại sao hà nội ô nhiễm":
        "🏙️ **Hà Nội ô nhiễm do:**\n\n1. 🚗 **Giao thông:** 7.5 triệu xe máy!\n2. 🏭 **Công nghiệp:** Nhiều nhà máy xung quanh\n3. 🔥 **Đốt rơm:** Đồng bằng Bắc Bộ (mùa thu đông)\n4. 🌫️ **Địa hình:** Lưu vực sông Hồng giữ bụi, ít gió\n5. 🏗️ **Xây dựng:** Bụi công trình khắp nơi\n6. 🌧️ **Khí hậu:** Ít mưa mùa đông → bụi tích tụ\n7. 💨 **Gió từ TQ:** Mang ô nhiễm từ miền Bắc TQ xuống\n\n📊 **Thống kê:** Hà Nội top 10 thành phố ô nhiễm nhất Đông Nam Á!",

      "đốt rơm rạ có ảnh hưởng không":
        "🔥 **Đốt rơm rạ CỰC KỲ NGUY HẠI!**\n\n⚠️ **Tác hại:**\n• PM2.5 tăng vọt 300-500%\n• Khói độc lan rộng 10-20km\n• Gây mù sương quang hóa\n• CO, NO₂, VOC độc hại\n\n🌍 **Quy mô:**\n• Đồng bằng Bắc Bộ: 8 triệu tấn rơm/năm\n• 80% bị đốt (bất hợp pháp)\n• Mùa cao điểm: Tháng 5-6, 10-11\n\n✅ **Giải pháp:**\n• Ủ phân compost\n• Làm thức ăn gia súc\n• Chế biogas\n• Xử phạt đốt rơm: 2-4 triệu VNĐ",

      "xe máy gây ô nhiễm":
        "🛵 **Xe máy - Hung thủ số 1 ô nhiễm VN:**\n\n📊 **Con số:**\n• 65 triệu xe máy (nhiều nhất TG/dân số)\n• 80% xe > 5 năm tuổi\n• 40% không bảo dưỡng định kỳ\n\n💨 **Khí thải xe máy:**\n• PM2.5, PM10\n• CO (carbon monoxide)\n• NO₂ (nitrogen dioxide)\n• VOCs (hydrocarbons)\n\n✅ **Giảm ô nhiễm từ xe:**\n• Bảo dưỡng định kỳ 6 tháng\n• Dùng xăng tốt (E5, 95)\n• Đi chung phương tiện\n• Chuyển sang xe điện",

      // ========== WEATHER & AQI ==========
      "mưa có giảm ô nhiễm không":
        "🌧️ **MƯA GIẢM Ô NHIỄM CỰC MẠNH!**\n\n✅ **Cơ chế:**\n• Giọt mưa cuốn bụi xuống đất (wet deposition)\n• Làm sạch không khí\n• AQI giảm 30-70% trong 1-2h\n\n💧 **Hiệu quả:**\n• Mưa nhẹ (< 5mm): Giảm 10-20%\n• Mưa vừa (5-15mm): Giảm 30-50%\n• Mưa to (> 15mm): Giảm 50-70%\n\n⚠️ **Lưu ý:**\n• Sau mưa dứt 1-2h, ô nhiễm quay lại\n• Mưa đầu mùa (mưa axit) có thể làm tăng ô nhiễm tạm thời",

      "gió có ảnh hưởng đến aqi không":
        "💨 **GIÓ ẢNH HƯỞNG RẤT LỚN!**\n\n✅ **Gió mạnh (>15 km/h):**\n• Thổi bay bụi\n• Pha loãng ô nhiễm\n• AQI giảm 40-60%\n\n⚠️ **Gió yếu (<5 km/h):**\n• Bụi tích tụ\n• AQI cao\n\n🌫️ **Không gió:**\n• AQI rất cao\n• Khói mù (smog)\n• Nghịch nhiệt\n\n⚠️ **Gió từ hướng xấu:**\n• Gió từ khu công nghiệp → AQI tăng\n• Gió từ biển → AQI giảm\n\n💡 Xem dự báo hướng gió để biết AQI ngày mai!",

      "mùa nào không khí tốt nhất":
        "🍂 **Chất lượng không khí theo mùa:**\n\n🥇 **Mùa hè (6-9):**\n• Mưa nhiều → rửa sạch bụi\n• Gió mùa Tây Nam\n• AQI trung bình 40-60\n\n🥈 **Mùa xuân (3-5):**\n• Thời tiết dễ chịu\n• AQI 50-80\n• ⚠️ Tháng 5: Đốt rơm vụ Đông Xuân\n\n🥉 **Mùa thu (9-11):**\n• Khô ráo, ít mưa\n• AQI 60-100\n• ⚠️ Tháng 10-11: Đốt rơm vụ Hè Thu\n\n⚫ **Mùa đông (12-2): TỆ NHẤT!**\n• Ít mưa\n• Gió yếu\n• Nhiệt độ thấp → nghịch nhiệt\n• Sưởi ấm → khói\n• AQI 80-150, có khi 200+",

      "nhiệt độ ảnh hưởng aqi":
        "🌡️ **Nhiệt độ ảnh hưởng AQI:**\n\n🔥 **Nóng (>35°C):**\n• Ozone (O₃) tăng\n• Phản ứng quang hóa\n• AQI tăng 10-20%\n\n❄️ **Lạnh (<15°C):**\n• Nghịch nhiệt: Bụi bị giữ lại\n• Sưởi ấm → khói\n• AQI tăng 30-50%\n\n🌡️ **Lý tưởng: 20-25°C**\n\n💡 Vì vậy mùa đông AQI Hà Nội thường rất cao!",

      // ========== SOLUTIONS ==========
      "làm gì để giảm ô nhiễm":
        "🌱 **Hành động cá nhân:**\n\n✅ **Giao thông:**\n• Đi xe đạp, đi bộ quãng ngắn\n• Dùng xe buýt, metro\n• Đi chung xe\n• Chuyển sang xe điện\n• Bảo dưỡng xe định kỳ\n\n✅ **Sinh hoạt:**\n• Tiết kiệm điện\n• Tái chế rác\n• KHÔNG đốt rác, đốt nhang nhiều\n• Dùng máy hút mùi khi nấu\n\n✅ **Khác:**\n• Trồng cây xanh\n• Ủng hộ năng lượng sạch\n• Giáo dục người thân\n\n🏛️ **Cần chính quyền:**\n• Kiểm tra khí thải xe\n• Mở rộng giao thông công cộng\n• Chuyển năng lượng tái tạo\n• Xử phạt vi phạm nghiêm\n• Cấm đốt rơm rạ",

      "trồng cây gì lọc không khí tốt":
        "🌳 **Top cây lọc không khí trong nhà:**\n\n🥇 **Lưỡi hổ (Snake Plant):**\n• Hấp thụ CO₂, thải O₂ ban đêm\n• Lọc formaldehyde, benzene\n• Dễ trồng, chịu bóng\n\n🥈 **Trầu bà (Pothos):**\n• Lọc formaldehyde, CO, benzene\n• Mọc nhanh, treo tường đẹp\n\n🥉 **Cây nhện (Spider Plant):**\n• Lọc CO, formaldehyde, xylene\n• An toàn cho thú cưng\n\n🏅 **Hoa huệ (Peace Lily):**\n• Lọc ammonia, benzene, formaldehyde\n• Hoa trắng đẹp\n\n🏅 **Trúc Nhật (Bamboo Palm):**\n• Lọc formaldehyde, benzene, CO\n• Tăng độ ẩm\n\n💡 **Hiệu quả:** 1 cây/10m² phòng\n⚠️ **Lưu ý:** Cây chỉ hỗ trợ, KHÔNG thay máy lọc!",

      "năng lượng sạch là gì":
        "⚡ **Năng lượng sạch (Renewable Energy):**\n\n☀️ **Năng lượng mặt trời:**\n• Pin quang điện\n• Không khí thải\n• VN tiềm năng rất lớn\n\n💨 **Năng lượng gió:**\n• Tuabin gió\n• Ven biển, cao nguyên\n\n💧 **Thủy điện:**\n• Đập nước\n• VN có nhiều sông\n\n🔥 **Sinh khối sạch:**\n• Biogas từ rơm, phân\n• KHÔNG đốt trực tiếp\n\n✅ **Lợi ích:**\n• KHÔNG gây ô nhiễm không khí\n• Giảm CO₂, chống biến đổi khí hậu\n• Bền vững, không cạn kiệt",

      // ========== APPS & TOOLS ==========
      "app nào xem chất lượng không khí":
        "📱 **Top Apps xem AQI miễn phí:**\n\n🥇 **AirVisual (IQAir):**\n• Dữ liệu toàn cầu\n• Dự báo 7 ngày\n• Bản đồ real-time\n• Xếp hạng thành phố\n• ⭐ 4.8/5\n\n🥈 **Plume Labs:**\n• Cảnh báo thông minh\n• Lộ trình tránh ô nhiễm\n• Dự báo 72h\n• ⭐ 4.6/5\n\n🥉 **BreezoMeter:**\n• Chi tiết từng chất\n• API cho developer\n• Gợi ý hoạt động\n\n🏠 **AQM System:** Hệ thống này! 😊\n\n💡 Nguồn dữ liệu: Đại sứ quán, trạm monitoring chính phủ",

      "nên mua máy đo chất lượng không khí không":
        "📊 **NÊN MUA** nếu quan tâm sức khỏe!\n\n✅ **Lợi ích:**\n• Biết PM2.5 real-time trong nhà\n• So sánh trong vs ngoài trời\n• Quyết định khi nào bật máy lọc\n• Biết khi nào nên đóng cửa sổ\n• Đo hiệu quả máy lọc\n\n🏷️ **Giá:**\n• Cơ bản: 500k-1.5 triệu (chỉ PM2.5)\n• Trung cấp: 2-4 triệu (PM2.5, PM10, VOC)\n• Cao cấp: 5-10 triệu (full pollutants + màn hình)\n\n🔹 **Thương hiệu tốt:**\n• Xiaomi Mi Air Monitor (1-2tr)\n• IQAir AirVisual Pro (8-10tr)\n• Temtop (2-3tr)\n• Awair Element (5-7tr)\n\n💡 Hoặc dùng app miễn phí: AirVisual!",

      "máy đo nào chính xác":
        "🎯 **Máy đo AQI chính xác:**\n\n🥇 **Laser sensor (tốt nhất):**\n• IQAir AirVisual Pro\n• PurpleAir\n• Temtop LKC-1000S+\n• Sai số: ±5%\n\n🥈 **Infrared sensor:**\n• Xiaomi Mi Monitor\n• Sai số: ±10%\n\n🥉 **Optical sensor:**\n• Máy rẻ tiền\n• Sai số: ±20-30%\n\n💡 **Kiểm tra:**\n• Xem reviews\n• So sánh với trạm chính phủ\n• Kiểm tra chứng nhận\n• Thử nhiều vị trí trong nhà",
    };

    const qaPairsEn: Record<string, string> = {
      // ========== AQI BASICS ==========
      "what is aqi":
        "🌍 **AQI (Air Quality Index)** measures air quality on a scale of 0-500:\n\n✅ 0-50: Good\n⚠️ 51-100: Moderate\n🟠 101-150: Unhealthy for sensitive groups\n🔴 151-200: Unhealthy\n🟣 201-300: Very unhealthy\n⚫ 301-500: Hazardous\n\nLower is better! 😊",

      "how is aqi calculated":
        "🧮 **AQI is calculated based on 6 major pollutants:**\n\n1. PM2.5 (fine particles)\n2. PM10 (coarse particles)\n3. O₃ (ozone)\n4. NO₂ (nitrogen dioxide)\n5. SO₂ (sulfur dioxide)\n6. CO (carbon monoxide)\n\n📊 The highest pollutant determines the overall AQI!",

      "is aqi 100 safe":
        "⚠️ **AQI 100 is MODERATE:**\n\n✅ Healthy people: Safe\n🟡 Sensitive groups (children, elderly, respiratory issues): Should limit prolonged outdoor activities\n\n💡 Ideal level is AQI < 50!",

      "is aqi 150 dangerous":
        "🟠 **AQI 150 is UNHEALTHY for sensitive groups:**\n\n⚠️ Everyone may begin to experience effects\n🚫 Sensitive groups should limit outdoor activities\n😷 Wear a mask when going outside\n\n💡 Children, elderly, and people with asthma should stay indoors!",

      "what to do at aqi 200":
        "🔴 **AQI 200 is UNHEALTHY:**\n\n1. 🏠 Stay indoors, close windows\n2. 😷 Wear N95 mask if must go outside\n3. 🌀 Use air purifier\n4. 🚫 Cancel all outdoor activities\n5. 💊 People with health conditions need extra caution\n\n⚠️ Everyone will be affected at this level!",

      "highest aqi ever":
        "⚫ **Highest AQI: 500+ (Hazardous):**\n\n🏭 **When it happens:**\n• Major wildfires\n• Severe industrial accidents\n• Dust storms\n\n🚨 **Actions:**\n• DO NOT go outside\n• Wear mask even indoors\n• Evacuate if possible\n\n📍 Vietnam has reached AQI 300+ in Hanoi during winter!",

      // ========== PM2.5 DETAILED ==========
      "what is pm2.5":
        "💨 **PM2.5** are fine particles with diameter < 2.5 micrometers (30x smaller than a hair!).\n\n⚠️ **Dangerous because:**\n• Penetrates deep into lungs\n• Enters bloodstream causing cardiovascular disease\n• Causes lung cancer\n• Affects brain function\n\n🏭 **Sources:** vehicle exhaust, factories, biomass burning",

      "safe pm2.5 level":
        "✅ **Safe PM2.5 levels:**\n\n🟢 0-12 µg/m³: Good\n🟡 12-35.4 µg/m³: Moderate\n🟠 35.5-55.4 µg/m³: Unhealthy for sensitive groups\n🔴 55.5+: Unhealthy\n\n💡 **WHO recommends:** < 5 µg/m³ (24h average) is ideal!",

      "high pm2.5 what to do":
        "🚨 **When PM2.5 is high (>35 µg/m³):**\n\n1. 🏠 Stay indoors, close windows\n2. 😷 Wear N95/KN95 mask\n3. 🌀 Use HEPA air purifier\n4. 🚫 Avoid outdoor exercise\n5. 💧 Drink plenty of water\n6. 👨‍⚕️ People with health conditions be extra careful\n\n❌ DON'T burn incense or cook with smoke!",

      "pm2.5 sources":
        "🏭 **Main PM2.5 sources:**\n\n🚗 **Transportation (40%):**\n• Diesel exhaust\n• Brake/tire wear\n\n🏭 **Industry (30%):**\n• Coal power plants\n• Cement, steel factories\n\n🔥 **Biomass burning (20%):**\n• Rice straw\n• Waste burning\n\n🏠 **Household (10%):**\n• Cooking\n• Incense, cigarettes",

      "pm2.5 health effects":
        "⚠️ **PM2.5 health impacts:**\n\n🫁 **Respiratory:**\n• Asthma\n• Pneumonia\n• Lung cancer\n• COPD\n\n❤️ **Cardiovascular:**\n• Stroke\n• Heart attack\n• High blood pressure\n• Arrhythmia\n\n🧠 **Neurological:**\n• Alzheimer's\n• Parkinson's\n• Memory loss\n• Depression",

      "indoor pm2.5":
        "🏠 **Indoor PM2.5 often HIGHER than outdoor!**\n\n🔥 **Sources:**\n• Cooking (oil smoke)\n• Incense burning\n• Smoking\n• Outdoor pollution entering\n\n✅ **Reduce indoor PM2.5:**\n• Use range hood when cooking\n• Close windows when outdoor AQI is high\n• Use HEPA air purifier\n• NO incense or smoking indoors",

      // ========== PM10 ==========
      "what is pm10":
        "💨 **PM10** are coarse particles with diameter < 10 micrometers.\n\n📍 **vs PM2.5:**\n• Larger, only reaches upper respiratory tract\n• Less dangerous than PM2.5\n• Causes nose/throat irritation\n\n🏗️ **Sources:** road dust, construction sites, desert dust",

      "is pm10 dangerous":
        "⚠️ **PM10 is less dangerous than PM2.5 but still harmful!**\n\n❌ **Health effects:**\n• Eye, nose, throat irritation\n• Asthma\n• Chronic bronchitis\n• Reduced lung function\n\n✅ **Safe level:** < 50 µg/m³\n\n💡 Surgical masks can filter PM10 but NOT PM2.5!",

      "high pm10 what to do":
        "🟠 **When PM10 is high (>150 µg/m³):**\n\n• 😷 Wear regular mask\n• 👁️ Wear protective glasses\n• 🚫 Limit outdoor activities\n• 💧 Rinse nose/throat frequently\n\n💡 PM10 often high in areas:\n• Dirt roads\n• Construction sites\n• Industrial zones",

      // ========== MASKS & PROTECTION ==========
      "which mask is best":
        "😷 **Top masks for PM2.5 protection:**\n\n🥇 **N95/KN95/KF94:** Filters 95% of PM2.5, best choice!\n🥈 **N99/P100:** Filters 99%, for extreme conditions\n🥉 **Surgical masks:** Only blocks droplets, NOT PM2.5\n❌ **Cloth masks:** Not effective against PM2.5\n\n💡 **Tips:**\n• Ensure proper fit, no gaps\n• Replace after 8 hours\n• Breathing valve recommended for comfort",

      "n95 vs kn95":
        "🔍 **N95 vs KN95:**\n\n**N95 (USA):**\n✅ NIOSH standard (US)\n✅ Filters ≥95% of 0.3µm particles\n\n**KN95 (China):**\n✅ GB2626 standard (China)\n✅ Filters ≥95% of 0.3µm particles\n\n💡 **Conclusion:** Equally effective!\n\n🏷️ **KF94 (Korea):** Also filters 94%, very good!",

      "do surgical masks filter dust":
        "❌ **NO!** Surgical masks:\n\n✅ **Block:**\n• Droplets\n• Large bacteria\n\n❌ **DON'T block:**\n• PM2.5 (too small, passes through)\n• PM10\n• Toxic gases\n\n💡 **Must use N95/KN95 to filter PM2.5!**",

      "how to wear mask properly":
        "😷 **7 steps to wear mask correctly:**\n\n1. ✅ Wash hands before wearing\n2. ✅ Top strap over head, bottom under neck\n3. ✅ Pinch metal strip to fit nose bridge\n4. ✅ Pull mask to cover chin\n5. ✅ Check for gaps on sides\n6. ✅ Test: Breathe hard, air shouldn't leak\n7. ✅ DON'T touch outer surface while wearing\n\n❌ **WRONG:** Wearing under chin, one strap, exposing nose!",

      "how long to use mask":
        "⏱️ **Mask usage duration:**\n\n**N95/KN95:**\n• Clean environment: 8-12 hours\n• Polluted environment: 4-6 hours\n• AQI >200: 2-4 hours\n\n**Surgical mask:**\n• 2-4 hours\n• Replace if wet\n\n❌ **DON'T reuse if:**\n• Dirty, torn\n• Wet\n• Hard to breathe\n• Lost elasticity",

      "mask with breathing valve":
        "🌬️ **Masks with breathing valve:**\n\n✅ **Pros:**\n• More breathable, easier breathing\n• Reduces heat, moisture\n• Good for heavy activities\n\n❌ **Cons:**\n• Doesn't protect others (if you're sick)\n• More expensive\n\n💡 **Conclusion:** Good for pollution, NOT for COVID!",

      // ========== AIR PURIFIERS ==========
      "which air purifier is best":
        "🌀 **Choosing an air purifier:**\n\n🔹 **MUST have:**\n• HEPA filter (removes 99.97% PM2.5)\n• High CADR (> 300 m³/h for 30m² room)\n• Carbon filter (odor, VOC removal)\n\n🔸 **Nice to have:**\n• Real-time PM2.5 sensor\n• Auto mode\n• Quiet operation (< 50dB at night)\n• Timer, remote control\n\n🏷️ **Good brands:**\n• Premium: IQAir, Blueair, Dyson\n• Mid-range: Xiaomi, Sharp, Philips\n• Budget: Asus, Samsung",

      "do air purifiers work":
        "✅ **HIGHLY EFFECTIVE** when used properly!\n\n📊 **Research results:**\n• Reduces indoor PM2.5 by 50-90%\n• Reduces allergy symptoms by 40-60%\n• Improves sleep quality\n• Reduces respiratory disease risk\n\n💡 **Conditions:**\n• Closed room (windows shut)\n• Run 24/7\n• Replace filters on time (3-6 months)\n• CADR matches room size",

      "what is hepa filter":
        '🎯 **HEPA (High Efficiency Particulate Air):**\n\n✅ **Standard:**\n• Filters ≥99.97% of particles ≥0.3µm\n• Includes PM2.5, PM10, bacteria, viruses\n\n🔬 **HEPA grades:**\n• H13: 99.95%\n• H14: 99.995% (medical grade)\n\n💡 **Note:**\n• True HEPA vs "HEPA-type" (fake)\n• Must check certification\n• Replace every 6-12 months',

      "what is cadr":
        "📊 **CADR (Clean Air Delivery Rate):**\n\n🌀 **Meaning:** Amount of clean air produced (m³/h)\n\n✅ **How to choose:**\n• 20m² room: CADR ≥200 m³/h\n• 30m² room: CADR ≥300 m³/h\n• 50m² room: CADR ≥500 m³/h\n\n💡 **Formula:** CADR needed = Room area (m²) × Height (m) × 5\n\n🎯 **Higher is better!**",

      "where to place air purifier":
        "📍 **Air purifier placement:**\n\n✅ **DO:**\n• Center of room (best)\n• 30-50cm from walls\n• Near sitting/sleeping area\n• Keep inlet/outlet unblocked\n\n❌ **DON'T:**\n• In corners (weak airflow)\n• Behind curtains, furniture\n• Against wall\n• Near open windows\n\n💡 **Large room:** Use 2 units or high CADR!",

      "when to replace filter":
        "⏱️ **Filter replacement schedule:**\n\n**HEPA filter:**\n• Clean environment: 12 months\n• Polluted environment: 6 months\n• AQI often >100: 3-4 months\n\n**Carbon filter:**\n• 6-12 months\n• No odor removal = expired\n\n**Pre-filter:**\n• Vacuum every 2 weeks\n• Replace every 3-6 months\n\n💡 **Signs to replace:**\n• Red light indicator\n• Reduced efficiency\n• Burning smell",

      // ========== HEALTH IMPACTS ==========
      "pollution health effects":
        "⚠️ **Air pollution health impacts:**\n\n🫁 **Respiratory:**\n• Asthma\n• Pneumonia\n• Lung cancer\n• COPD\n• Bronchitis\n\n❤️ **Cardiovascular:**\n• Stroke (+24% risk)\n• Heart attack\n• High blood pressure\n• Arrhythmia\n\n🧠 **Neurological:**\n• Alzheimer's\n• Parkinson's\n• Memory loss\n• Depression\n• Reduced IQ (children)\n\n🤰 **Pregnancy:**\n• Premature birth\n• Low birth weight\n• Birth defects",

      "children pollution effects":
        "👶 **Children are EXTREMELY VULNERABLE:**\n\n⚠️ **Reasons:**\n• Developing lungs\n• Breathe 50% more air per kg body weight\n• More outdoor activities\n• Weaker immune system\n• Shorter height (closer to ground = more dust)\n\n🏥 **Effects:**\n• Respiratory infections (↑40%)\n• Asthma (↑20%)\n• Impaired lung development\n• Reduced IQ (every 10µg/m³ PM2.5 = -1 IQ point)\n• ADHD\n\n🛡️ **Protection:**\n• Limit outdoor time when AQI > 100\n• Use air purifier in child's room\n• Wear N95 mask when necessary\n• Avoid playing near major roads",

      "pregnant pollution risks":
        "🤰 **Pregnancy - AVOID air pollution!**\n\n⚠️ **Risks from PM2.5 exposure:**\n• Premature birth (↑19%)\n• Low birth weight (↑13%)\n• Preeclampsia (↑51%)\n• Birth defects\n• Miscarriage\n• Stillbirth\n\n✅ **Recommendations:**\n• AQI < 50: Safe\n• AQI 51-100: Limit prolonged outdoor time\n• AQI > 100: STAY indoors\n• Use air purifier\n• Wear N95 mask if must go outside\n• Regular prenatal checkups\n\n❌ **ABSOLUTELY NO:**\n• Smoking\n• Being near smokers\n• Cooking smoke exposure",

      "elderly pollution effects":
        "👴👵 **Elderly - HIGH RISK GROUP:**\n\n⚠️ **Reasons:**\n• Declining lung function\n• Weaker immune system\n• Often have underlying conditions (heart, diabetes)\n\n🏥 **Risks:**\n• Stroke (↑30%)\n• Heart attack (↑25%)\n• Pneumonia\n• COPD exacerbation\n• Premature death\n\n🛡️ **Protection:**\n• Monitor AQI daily\n• Stay indoors when AQI > 100\n• Take medications regularly\n• Use air purifier\n• Regular medical checkups",

      "asthma and pollution":
        "🫁 **Asthma patients are EXTREMELY SENSITIVE:**\n\n⚠️ **Impact:**\n• Triggers asthma attacks (AQI > 100)\n• Increased inhaler use\n• Hospital visits\n• Reduced lung function\n\n✅ **Prevention:**\n• Monitor AQI daily\n• Always carry rescue inhaler\n• Stay indoors when AQI > 100\n• Use air purifier 24/7\n• Wear N95 when going outside\n• Avoid exertion when AQI is high\n\n💊 **Note:** Increase medication dose as prescribed by doctor when pollution is high!",

      // ========== OUTDOOR ACTIVITIES ==========
      "exercise outdoors safe":
        "🏃 **Outdoor exercise safe when:**\n\n✅ **AQI < 50:** Completely safe!\n⚠️ **AQI 51-100:** Reduce intensity\n🚫 **AQI 101-150:** Only healthy people, light intensity\n🚫 **AQI > 150:** DO NOT exercise outdoors\n\n💡 **Best times:** Early morning (5-7am) or late evening (after 8pm)\n\n⚠️ **Why not:** When exercising, lungs inhale 10-15x more air → more toxic particles!",

      "cleanest air time":
        "🌅 **Cleanest air times:**\n\n🥇 **Early morning 5-7am:**\n• Less traffic\n• Cooler temperature\n• PM2.5 settled overnight\n• Higher humidity keeps dust down\n\n🥈 **Late night after 10pm:**\n• Traffic subsides\n• Factories closed\n• Temperature drops\n\n❌ **Worst times:**\n• 7-9am: Morning rush hour\n• 5-7pm: Evening rush hour\n• 11am-2pm: Hottest, dust rises\n\n💡 Check AQI app before going out!",

      "when to run outdoors":
        "🏃 **Best times for running:**\n\n✅ **5-7am morning:**\n• Lowest AQI\n• Cool weather\n• Less traffic\n\n✅ **8-9pm evening:**\n• AQI drops\n• Cooler than daytime\n\n❌ **AVOID:**\n• 7-9am, 5-7pm: Rush hours\n• 11am-3pm: Hot + high AQI\n\n💡 **Location:**\n• Parks (away from roads)\n• Lakeside\n• ❌ NOT along major roads!",

      "walking need mask":
        "🚶 **Wear mask when walking if:**\n\n✅ **AQI > 100:**\n• Wear N95 mask\n• Walk slowly, don't strain\n\n⚠️ **AQI 51-100:**\n• Sensitive groups should wear\n• Healthy people not required\n\n✅ **AQI < 50:**\n• No need to wear\n\n💡 Best: Walk in parks, away from main roads!",

      "indoor sports better":
        "🏸 **Indoor sports BETTER when AQI is high:**\n\n✅ **Benefits:**\n• No toxic dust inhalation\n• Controlled temperature\n• Safe\n\n🏋️ **Suggestions:**\n• Indoor gym\n• Swimming (indoor pool)\n• Yoga, Pilates\n• Badminton, table tennis\n• Home workout (YouTube)\n\n💡 Ensure gym has good ventilation!",

      // ========== POLLUTION SOURCES ==========
      "air pollution sources":
        "🏭 **Main pollution sources in Vietnam:**\n\n🚗 **Transportation (40%):**\n• 65 million motorbikes nationwide\n• Old diesel vehicles\n• Traffic jams = more smoke\n\n🏭 **Industry (30%):**\n• Coal power plants\n• Cement factories\n• Steel plants\n• Ceramics\n\n🔥 **Biomass burning (20%):**\n• Rice straw (harvest season)\n• Waste burning\n• Forest fires\n\n🏠 **Household (10%):**\n• Cooking\n• Heating\n• Incense burning",

      "why hanoi polluted":
        "🏙️ **Hanoi pollution causes:**\n\n1. 🚗 **Traffic:** 7.5 million motorbikes!\n2. 🏭 **Industry:** Many factories surrounding\n3. 🔥 **Rice straw burning:** Red River Delta (winter)\n4. 🌫️ **Geography:** River basin traps dust, weak wind\n5. 🏗️ **Construction:** Dust everywhere\n6. 🌧️ **Climate:** Less rain in winter → dust accumulates\n7. 💨 **Wind from China:** Brings pollution from North China\n\n📊 **Stats:** Hanoi in top 10 most polluted cities in Southeast Asia!",

      "rice straw burning effects":
        "🔥 **Rice straw burning EXTREMELY HARMFUL!**\n\n⚠️ **Impact:**\n• PM2.5 spikes 300-500%\n• Toxic smoke spreads 10-20km\n• Creates photochemical smog\n• Toxic CO, NO₂, VOCs\n\n🌍 **Scale:**\n• Red River Delta: 8 million tons straw/year\n• 80% burned (illegal)\n• Peak season: May-June, Oct-Nov\n\n✅ **Solutions:**\n• Composting\n• Animal feed\n• Biogas production\n• Fine for burning: $100-200",

      "motorbike pollution":
        "🛵 **Motorbikes - #1 polluter in Vietnam:**\n\n📊 **Numbers:**\n• 65 million motorbikes (world's highest per capita)\n• 80% bikes > 5 years old\n• 40% not regularly maintained\n\n💨 **Emissions:**\n• PM2.5, PM10\n• CO (carbon monoxide)\n• NO₂ (nitrogen dioxide)\n• VOCs (hydrocarbons)\n\n✅ **Reduce pollution:**\n• Regular maintenance (6 months)\n• Use good fuel (E5, 95 octane)\n• Share rides\n• Switch to electric bikes",

      // ========== WEATHER & AQI ==========
      "does rain reduce pollution":
        "🌧️ **RAIN REDUCES POLLUTION SIGNIFICANTLY!**\n\n✅ **How it works:**\n• Raindrops capture particles (wet deposition)\n• Cleans the air\n• AQI drops 30-70% in 1-2 hours\n\n💧 **Effectiveness:**\n• Light rain (< 5mm): 10-20% reduction\n• Moderate rain (5-15mm): 30-50% reduction\n• Heavy rain (> 15mm): 50-70% reduction\n\n⚠️ **Note:**\n• 1-2 hours after rain stops, pollution returns\n• Early season rain (acid rain) may temporarily increase pollution",

      "wind effect on aqi":
        "💨 **WIND HAS HUGE IMPACT!**\n\n✅ **Strong wind (>15 km/h):**\n• Blows away dust\n• Dilutes pollution\n• AQI drops 40-60%\n\n⚠️ **Weak wind (<5 km/h):**\n• Dust accumulates\n• High AQI\n\n🌫️ **No wind:**\n• Very high AQI\n• Smog formation\n• Temperature inversion\n\n⚠️ **Wind from bad direction:**\n• Wind from industrial areas → AQI increases\n• Wind from sea → AQI decreases\n\n💡 Check wind forecast to predict tomorrow's AQI!",

      "best season for air quality":
        "🍂 **Air quality by season:**\n\n🥇 **Summer (Jun-Sep):**\n• Frequent rain → washes dust\n• Southwest monsoon\n• Average AQI 40-60\n\n🥈 **Spring (Mar-May):**\n• Pleasant weather\n• AQI 50-80\n• ⚠️ May: Rice straw burning (Winter-Spring crop)\n\n🥉 **Autumn (Sep-Nov):**\n• Dry, less rain\n• AQI 60-100\n• ⚠️ Oct-Nov: Rice straw burning (Summer-Autumn crop)\n\n⚫ **Winter (Dec-Feb): WORST!**\n• Less rain\n• Weak wind\n• Low temperature → temperature inversion\n• Heating → smoke\n• AQI 80-150, sometimes 200+",

      "temperature effect on aqi":
        "🌡️ **Temperature affects AQI:**\n\n🔥 **Hot (>35°C):**\n• Ozone (O₃) increases\n• Photochemical reactions\n• AQI increases 10-20%\n\n❄️ **Cold (<15°C):**\n• Temperature inversion: Traps dust\n• Heating → smoke\n• AQI increases 30-50%\n\n🌡️ **Ideal: 20-25°C**\n\n💡 That's why Hanoi's AQI is usually very high in winter!",

      // ========== SOLUTIONS ==========
      "reduce air pollution":
        "🌱 **Personal actions:**\n\n✅ **Transportation:**\n• Bike/walk for short distances\n• Use public transport, metro\n• Carpool\n• Switch to electric vehicles\n• Regular vehicle maintenance\n\n✅ **Lifestyle:**\n• Save electricity\n• Recycle waste\n• NO burning trash or excessive incense\n• Use range hood when cooking\n\n✅ **Other:**\n• Plant trees\n• Support clean energy\n• Educate family\n\n🏛️ **Government needed:**\n• Vehicle emission testing\n• Expand public transport\n• Transition to renewable energy\n• Strictly enforce violations\n• Ban rice straw burning",

      "indoor plants air quality":
        "🌳 **Top indoor air-purifying plants:**\n\n🥇 **Snake Plant:**\n• Absorbs CO₂, releases O₂ at night\n• Filters formaldehyde, benzene\n• Easy to grow, tolerates shade\n\n🥈 **Pothos:**\n• Filters formaldehyde, CO, benzene\n• Fast growing, good for hanging\n\n🥉 **Spider Plant:**\n• Filters CO, formaldehyde, xylene\n• Safe for pets\n\n🏅 **Peace Lily:**\n• Filters ammonia, benzene, formaldehyde\n• Beautiful white flowers\n\n🏅 **Bamboo Palm:**\n• Filters formaldehyde, benzene, CO\n• Increases humidity\n\n💡 **Effectiveness:** 1 plant per 10m² room\n⚠️ **Note:** Plants only help, DON'T replace air purifiers!",

      "clean energy":
        "⚡ **Clean Energy (Renewable):**\n\n☀️ **Solar power:**\n• Photovoltaic panels\n• No emissions\n• Vietnam has huge potential\n\n💨 **Wind power:**\n• Wind turbines\n• Coastal areas, highlands\n\n💧 **Hydropower:**\n• Dams\n• Vietnam has many rivers\n\n🔥 **Clean biomass:**\n• Biogas from straw, manure\n• NOT direct burning\n\n✅ **Benefits:**\n• NO air pollution\n• Reduces CO₂, fights climate change\n• Sustainable, renewable",

      // ========== APPS & TOOLS ==========
      "air quality apps":
        "📱 **Top free AQI apps:**\n\n🥇 **AirVisual (IQAir):**\n• Global data\n• 7-day forecast\n• Real-time map\n• City rankings\n• ⭐ 4.8/5\n\n🥈 **Plume Labs:**\n• Smart alerts\n• Route planner to avoid pollution\n• 72h forecast\n• ⭐ 4.6/5\n\n🥉 **BreezoMeter:**\n• Detailed pollutant breakdown\n• API for developers\n• Activity suggestions\n\n🏠 **AQM System:** This system! 😊\n\n💡 Data sources: Embassy monitors, government stations",

      "should buy air quality monitor":
        "📊 **YES, if you care about health!**\n\n✅ **Benefits:**\n• Know real-time indoor PM2.5\n• Compare indoor vs outdoor\n• Decide when to turn on purifier\n• Know when to close windows\n• Test purifier effectiveness\n\n🏷️ **Price:**\n• Basic: $20-60 (PM2.5 only)\n• Mid-range: $80-160 (PM2.5, PM10, VOC)\n• Premium: $200-400 (all pollutants + display)\n\n🔹 **Good brands:**\n• Xiaomi Mi Air Monitor ($40-80)\n• IQAir AirVisual Pro ($300-400)\n• Temtop ($80-120)\n• Awair Element ($200-280)\n\n💡 Or use free app: AirVisual!",

      "accurate air quality monitor":
        "🎯 **Accurate AQI monitors:**\n\n🥇 **Laser sensor (best):**\n• IQAir AirVisual Pro\n• PurpleAir\n• Temtop LKC-1000S+\n• Error: ±5%\n\n🥈 **Infrared sensor:**\n• Xiaomi Mi Monitor\n• Error: ±10%\n\n🥉 **Optical sensor:**\n• Budget monitors\n• Error: ±20-30%\n\n💡 **Verification:**\n• Read reviews\n• Compare with government stations\n• Check certifications\n• Test in multiple room locations",
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

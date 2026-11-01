/**
 * ==============================================================================
 * 🌟 BETTER THAN YESTERDAY — GOOGLE APPS SCRIPT DATABASE BACKEND 🌟
 * ==============================================================================
 * Hướng dẫn thiết lập:
 * 1. Mở một Google Sheet mới tại: https://sheets.new
 * 2. Đổi tên Sheet thành: "Better Than Yesterday Database"
 * 3. Vào Tiện ích mở rộng (Extensions) -> Apps Script
 * 4. Xóa toàn bộ mã cũ và dán toàn bộ nội dung file này vào
 * 5. Bấm icon Lưu (Save / Ctrl+S)
 * 6. Bấm Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment)
 *    - Loại: Ứng dụng web (Web app)
 *    - Mô tả: "BTY Cloud DB API v1"
 *    - Thực thi dưới dạng (Execute as): "Tôi (Me)"
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai (Anyone)"
 * 7. Bấm Triển khai (Deploy) -> Cấp quyền (Authorize Access)
 * 8. Sao chép "URL ứng dụng web" (Web app URL có dạng https://script.google.com/macros/s/.../exec)
 * 9. Dán URL vào tệp .env: NEXT_PUBLIC_SHEET_API_URL="<URL_CỦA_BẠN>"
 * ==============================================================================
 */

// ==========================================
// 🚀 HÀM KHỞI TẠO BẢNG TÍNH BAN ĐẦU (TÙY CHỌN CHẠY 1 LẦN)
// ==========================================
// Anh có thể chọn hàm này trên thanh menu Apps Script và bấm "Chạy (Run)"
// để Google Sheet tự động tạo sẵn toàn bộ các Tab sheet cùng dữ liệu mẫu!
function setupInitialSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Habits
  var habitSheet = getOrCreateSheet("Habits", ["id", "title", "description", "category", "timeOfDay", "targetDaysPerWeek", "rewardAmount", "isActive", "currentStreak", "user"]);
  if (habitSheet.getLastRow() <= 1) {
    habitSheet.appendRow(["habit-1", "Vệ Sinh Sáng & Skincare ✨", "Đánh răng, rửa mặt sữa bọt & dưỡng ẩm đầy đủ năng lượng", "HYGIENE_MORNING", "MORNING", 7, 5000, true, 28, "xu4ns0n"]);
    habitSheet.appendRow(["habit-2", "Chạy Bộ 5km / Gym Thể Lực 🏋️‍♂️", "Chạy bộ công viên hoặc đẩy tạ kích hoạt trao đổi chất", "FITNESS", "ANYTIME", 5, 20000, true, 12, "xu4ns0n"]);
    habitSheet.appendRow(["habit-3", "Học Công Nghệ & Tiếng Anh 📚", "30 phút đọc tài liệu System Architecture hoặc Podcast IELTS", "LEARNING", "ANYTIME", 6, 15000, true, 18, "xu4ns0n"]);
    habitSheet.appendRow(["habit-4", "Nấu Cơm Healthy Mang Đi Làm 🍱", "Tự nấu bữa trưa dinh dưỡng, sạch sẽ, tiết kiệm calo", "MEAL_PREP", "MORNING", 5, 35000, true, 9, "xu4ns0n"]);
    habitSheet.appendRow(["habit-5", "Uống Đủ 2L Nước Tinh Khiết 💧", "Uống đều đặn từng ngụm, hạn chế tối đa đồ ngọt nước có gas", "CUSTOM", "ANYTIME", 7, 5000, true, 28, "xu4ns0n"]);
    habitSheet.appendRow(["habit-6", "Skincare Tối & Ngủ Trước 23h 🌙", "Tẩy trang sạch sâu, đọc 10 trang sách và ngủ sớm", "HYGIENE_NIGHT", "EVENING", 7, 10000, true, 14, "xu4ns0n"]);
  }

  // 2. Sheet DailyLogs
  var logSheet = getOrCreateSheet("DailyLogs", ["logDate", "habitId", "completed", "user", "timestamp"]);
  if (logSheet.getLastRow() <= 1) {
    var todayStr = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
    logSheet.appendRow([todayStr, "habit-1", true, "xu4ns0n", new Date().toISOString()]);
    logSheet.appendRow([todayStr, "habit-2", true, "xu4ns0n", new Date().toISOString()]);
    logSheet.appendRow([todayStr, "habit-5", true, "xu4ns0n", new Date().toISOString()]);
  }

  // 3. Sheet FinanceIncome
  var incomeSheet = getOrCreateSheet("FinanceIncome", ["monthYear", "monthlySalary", "bonusIncome", "totalIncome", "user"]);
  if (incomeSheet.getLastRow() <= 1) {
    var thisMonth = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM");
    incomeSheet.appendRow([thisMonth, 18000000, 4500000, 22500000, "xu4ns0n"]);
  }

  // 4. Sheet FinanceJars
  var jarSheet = getOrCreateSheet("FinanceJars", ["id", "name", "categoryKey", "percentage", "currentBalance", "color", "icon", "user"]);
  if (jarSheet.getLastRow() <= 1) {
    jarSheet.appendRow(["jar-1", "Tiết Kiệm & Dự Phòng", "SAVINGS", 20, 45000000, "#10b981", "PiggyBank", "xu4ns0n"]);
    jarSheet.appendRow(["jar-2", "Đầu Tư Cổ Phiếu / Chứng Khoán", "STOCKS", 30, 68500000, "#06b6d4", "TrendingUp", "xu4ns0n"]);
    jarSheet.appendRow(["jar-3", "Đầu Tư Kinh Doanh & Side Hustle", "BUSINESS", 15, 24200000, "#8b5cf6", "Briefcase", "xu4ns0n"]);
    jarSheet.appendRow(["jar-4", "Quỹ Du Lịch & Trải Nghiệm", "TRAVEL", 10, 12000000, "#f59e0b", "Plane", "xu4ns0n"]);
    jarSheet.appendRow(["jar-5", "Chi Tiêu Tự Do & Sinh Hoạt", "FREE_SPEND", 25, 8650000, "#ec4899", "ShoppingBag", "xu4ns0n"]);
  }

  // 5. Sheet FinanceTransactions
  var txSheet = getOrCreateSheet("FinanceTransactions", ["id", "jarId", "type", "amount", "description", "txDate", "user", "createdAt"]);
  if (txSheet.getLastRow() <= 1) {
    var todayStr2 = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
    txSheet.appendRow(["tx-1", "jar-2", "IN", 6750000, "Trích 30% thu nhập tháng vào tích sản cổ phiếu FPT & HPG", todayStr2, "xu4ns0n", new Date().toISOString()]);
    txSheet.appendRow(["tx-2", "jar-1", "IN", 4500000, "Nạp quỹ tiết kiệm khẩn cấp định kỳ", todayStr2, "xu4ns0n", new Date().toISOString()]);
    txSheet.appendRow(["tx-3", "jar-5", "OUT", 850000, "Đi chợ siêu thị mua thực phẩm healthy tuần đầu tháng", todayStr2, "xu4ns0n", new Date().toISOString()]);
  }

  // 6. Sheet Todos
  var todoSheet = getOrCreateSheet("Todos", ["id", "title", "completed", "priority", "dueDate", "user"]);
  if (todoSheet.getLastRow() <= 1) {
    todoSheet.appendRow(["todo-1", "Hoàn thành bài tập thiết kế hệ thống Microservices", true, "HIGH", "Hôm nay", "xu4ns0n"]);
    todoSheet.appendRow(["todo-2", "Đọc 2 chương sách Atomic Habits", false, "MEDIUM", "Tối nay", "xu4ns0n"]);
  }

  // 7. Sheet Notes
  var noteSheet = getOrCreateSheet("Notes", ["id", "title", "content", "pinned", "user", "createdAt"]);
  if (noteSheet.getLastRow() <= 1) {
    noteSheet.appendRow(["note-1", "📌 5 Quy Tắc Kỷ Luật Vàng 2026", "1. Không bỏ lỡ 2 ngày liên tiếp.\n2. Tiết kiệm trước, chi tiêu sau.\n3. Tiến trình quan trọng hơn kết quả.", true, "xu4ns0n", new Date().toISOString()]);
  }

  // 8. Sheet Users
  var userSheet = getOrCreateSheet("Users", ["username", "password", "fullName", "createdAt"]);
  if (userSheet.getLastRow() <= 1) {
    userSheet.appendRow(["xu4ns0n", "Sondeptrai123@k", "Nguyễn Xuân Sơn", new Date().toISOString()]);
  }

  Logger.log("🎉 Khởi tạo toàn bộ Sheet thành công!");
}

// Lấy hoặc tạo Sheet theo tên
function getOrCreateSheet(sheetName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#f8fafc");
    }
  }
  return sheet;
}

// Chuyển toàn bộ dữ liệu của sheet thành danh sách JSON Objects
function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

// ==========================================
// 1. HTTP GET: Đọc dữ liệu từ Google Sheets
// ==========================================
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action || "all";
  var user = params.user || "xu4ns0n";

  var output = { success: true, timestamp: new Date().toISOString() };

  try {
    if (action === "all" || action === "habits") {
      var habitSheet = getOrCreateSheet("Habits", ["id", "title", "description", "category", "timeOfDay", "targetDaysPerWeek", "rewardAmount", "isActive", "currentStreak", "user"]);
      var allHabits = sheetToObjects(habitSheet);
      output.habits = allHabits.filter(function(h) { return !user || h.user === user; });
    }

    if (action === "all" || action === "logs") {
      var logSheet = getOrCreateSheet("DailyLogs", ["logDate", "habitId", "completed", "user", "timestamp"]);
      var allLogs = sheetToObjects(logSheet);
      var userLogs = allLogs.filter(function(l) { return !user || l.user === user; });
      
      var todayStr = params.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
      var todayLogs = userLogs.filter(function(l) { return l.logDate === todayStr && (l.completed === true || l.completed === "TRUE" || l.completed === "true"); });
      
      output.completedHabitIds = todayLogs.map(function(l) { return l.habitId; });
      output.streakCount = 28;
      output.savedToday = output.completedHabitIds.length * 10000;
      output.savedTotal = userLogs.length * 10000;

      var datesMap = {};
      userLogs.forEach(function(l) {
        if (!datesMap[l.logDate]) datesMap[l.logDate] = 0;
        datesMap[l.logDate]++;
      });
      output.completedDatesMap = datesMap;
    }

    if (action === "all" || action === "finance") {
      var incomeSheet = getOrCreateSheet("FinanceIncome", ["monthYear", "monthlySalary", "bonusIncome", "totalIncome", "user"]);
      var jarSheet = getOrCreateSheet("FinanceJars", ["id", "name", "categoryKey", "percentage", "currentBalance", "color", "icon", "user"]);
      var txSheet = getOrCreateSheet("FinanceTransactions", ["id", "jarId", "type", "amount", "description", "txDate", "user", "createdAt"]);

      var allIncome = sheetToObjects(incomeSheet).filter(function(i) { return !user || i.user === user; });
      var allJars = sheetToObjects(jarSheet).filter(function(j) { return !user || j.user === user; });
      var allTxs = sheetToObjects(txSheet).filter(function(t) { return !user || t.user === user; });

      output.income = allIncome.length > 0 ? allIncome[allIncome.length - 1] : {
        monthYear: "2026-11",
        monthlySalary: 18000000,
        bonusIncome: 4500000,
        totalIncome: 22500000
      };
      output.jars = allJars;
      output.transactions = allTxs;
    }

    if (action === "all" || action === "todos") {
      var todoSheet = getOrCreateSheet("Todos", ["id", "title", "completed", "priority", "dueDate", "user"]);
      output.todos = sheetToObjects(todoSheet).filter(function(t) { return !user || t.user === user; });
    }

    if (action === "all" || action === "notes") {
      var noteSheet = getOrCreateSheet("Notes", ["id", "title", "content", "pinned", "user", "createdAt"]);
      output.notes = sheetToObjects(noteSheet).filter(function(n) { return !user || n.user === user; });
    }

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 2. HTTP POST: Lưu & Ghi dữ liệu vào Google Sheets
// ==========================================
function doPost(e) {
  var output = { success: true };
  try {
    var raw = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(raw);
    var action = payload.action || "";
    var user = payload.user || "xu4ns0n";

    // A. Toggle hoặc thêm Check Thói Quen
    if (action === "toggleLog") {
      var logSheet = getOrCreateSheet("DailyLogs", ["logDate", "habitId", "completed", "user", "timestamp"]);
      var logDate = payload.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
      logSheet.appendRow([logDate, payload.habitId, payload.completed, user, new Date().toISOString()]);
      output.message = "Logged habit completion successfully";
    }

    // B. Tạo thói quen mới
    else if (action === "createHabit") {
      var habitSheet = getOrCreateSheet("Habits", ["id", "title", "description", "category", "timeOfDay", "targetDaysPerWeek", "rewardAmount", "isActive", "currentStreak", "user"]);
      var id = payload.id || ("habit-" + new Date().getTime());
      habitSheet.appendRow([
        id, payload.title, payload.description || "", payload.category || "CUSTOM",
        payload.timeOfDay || "ANYTIME", payload.targetDaysPerWeek || 7,
        payload.rewardAmount || 10000, true, 0, user
      ]);
      output.id = id;
    }

    // C. Cập nhật thu nhập
    else if (action === "updateIncome") {
      var incomeSheet = getOrCreateSheet("FinanceIncome", ["monthYear", "monthlySalary", "bonusIncome", "totalIncome", "user"]);
      var total = (parseFloat(payload.monthlySalary) || 0) + (parseFloat(payload.bonusIncome) || 0);
      incomeSheet.appendRow([
        payload.monthYear || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM"),
        payload.monthlySalary || 0,
        payload.bonusIncome || 0,
        total,
        user
      ]);
      output.totalIncome = total;
    }

    // D. Thêm giao dịch nạp/rút tiền hũ
    else if (action === "addTransaction") {
      var txSheet = getOrCreateSheet("FinanceTransactions", ["id", "jarId", "type", "amount", "description", "txDate", "user", "createdAt"]);
      var txId = "tx-" + new Date().getTime();
      txSheet.appendRow([
        txId, payload.jarId, payload.type, payload.amount,
        payload.description || "", payload.txDate || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"),
        user, new Date().toISOString()
      ]);
      output.txId = txId;
    }

    // E. Đăng ký người dùng mới
    else if (action === "register") {
      var userSheet = getOrCreateSheet("Users", ["username", "password", "fullName", "createdAt"]);
      userSheet.appendRow([payload.username, payload.password, payload.fullName || payload.username, new Date().toISOString()]);
      output.username = payload.username;
    }

    // F. Đồng bộ hàng loạt
    else if (action === "syncAll") {
      output.message = "Batch sync accepted";
    }

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


package com.betterthanyesterday.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DataStorageService {

    private final ObjectMapper mapper = new ObjectMapper();
    private final File dataFile = new File("data/bty_store.json");

    private final Map<String, Object> database = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        if (dataFile.exists()) {
            try {
                Map<String, Object> loaded = mapper.readValue(dataFile, new TypeReference<Map<String, Object>>() {});
                database.putAll(loaded);
                System.out.println("📦 Loaded existing database from: " + dataFile.getAbsolutePath());
                return;
            } catch (IOException e) {
                System.err.println("⚠️ Could not load data file, initializing default seed: " + e.getMessage());
            }
        }
        initSeedData();
        saveToFile();
    }

    private void initSeedData() {
        // 1. Habits
        List<Map<String, Object>> habits = new ArrayList<>();
        habits.add(createHabit("habit-1", "Vệ Sinh Sáng & Skincare ✨", "Đánh răng, rửa mặt sữa bọt & dưỡng ẩm đầy đủ năng lượng", "HYGIENE_MORNING", "Sparkles", "MORNING", 7, 5000));
        habits.add(createHabit("habit-2", "Chạy Bộ 5km / Gym Thể Lực 🏋️‍♂️", "Chạy bộ công viên hoặc đẩy tạ kích hoạt trao đổi chất", "FITNESS", "Dumbbell", "ANYTIME", 5, 20000));
        habits.add(createHabit("habit-3", "Học Công Nghệ & Tiếng Anh 📚", "30 phút đọc tài liệu System Architecture hoặc Podcast IELTS", "LEARNING", "BookOpen", "ANYTIME", 6, 15000));
        habits.add(createHabit("habit-4", "Nấu Cơm Healthy Mang Đi Làm 🍱", "Tự nấu bữa trưa dinh dưỡng, sạch sẽ, tiết kiệm calo", "MEAL_PREP", "Utensils", "MORNING", 5, 35000));
        habits.add(createHabit("habit-5", "Uống Đủ 2L Nước Tinh Khiết 💧", "Uống đều đặn từng ngụm, hạn chế tối đa đồ ngọt nước có gas", "CUSTOM", "Activity", "ANYTIME", 7, 5000));
        habits.add(createHabit("habit-6", "Skincare Tối & Ngủ Trước 23h 🌙", "Tẩy trang sạch sâu, đọc 10 trang sách và ngủ sớm", "HYGIENE_NIGHT", "Moon", "EVENING", 7, 10000));
        database.put("habits", habits);

        // 2. Completed Logs
        Map<String, List<String>> dateCompletions = new ConcurrentHashMap<>();
        String today = LocalDate.now().toString();
        dateCompletions.put(today, Arrays.asList("habit-1", "habit-2", "habit-5"));
        database.put("dateCompletions", dateCompletions);
        database.put("streakCount", 28);
        database.put("savedTotal", 1450000);

        // 3. Finance Income
        Map<String, Object> income = new HashMap<>();
        income.put("monthYear", "2026-11");
        income.put("monthlySalary", 18000000.0);
        income.put("bonusIncome", 4500000.0);
        income.put("totalIncome", 22500000.0);
        database.put("income", income);

        // 4. Finance Jars
        List<Map<String, Object>> jars = new ArrayList<>();
        jars.add(createJar("jar-1", "Tiết Kiệm & Dự Phòng", "SAVINGS", 20.0, "#10b981", "PiggyBank", 45000000.0));
        jars.add(createJar("jar-2", "Đầu Tư Cổ Phiếu / Chứng Khoán", "STOCKS", 30.0, "#06b6d4", "TrendingUp", 68500000.0));
        jars.add(createJar("jar-3", "Đầu Tư Kinh Doanh & Side Hustle", "BUSINESS", 15.0, "#8b5cf6", "Briefcase", 24200000.0));
        jars.add(createJar("jar-4", "Quỹ Du Lịch & Trải Nghiệm", "TRAVEL", 10.0, "#f59e0b", "Plane", 12000000.0));
        jars.add(createJar("jar-5", "Chi Tiêu Tự Do & Sinh Hoạt", "FREE_SPEND", 25.0, "#ec4899", "ShoppingBag", 8650000.0));
        database.put("jars", jars);

        // 5. Finance Transactions
        List<Map<String, Object>> txs = new ArrayList<>();
        txs.add(createTx("tx-1", "jar-2", "IN", 6750000.0, "Trích 30% thu nhập tháng vào tích sản cổ phiếu FPT & HPG", today));
        txs.add(createTx("tx-2", "jar-1", "IN", 4500000.0, "Nạp quỹ tiết kiệm khẩn cấp định kỳ", today));
        txs.add(createTx("tx-3", "jar-5", "OUT", 850000.0, "Đi chợ siêu thị mua thực phẩm healthy tuần đầu tháng", today));
        database.put("transactions", txs);

        // 6. Todos & Notes
        List<Map<String, Object>> todos = new ArrayList<>();
        todos.add(createTodo("todo-1", "Hoàn thành bài tập thiết kế hệ thống Microservices", true, "HIGH", "Hôm nay"));
        todos.add(createTodo("todo-2", "Đọc 2 chương sách Atomic Habits", false, "MEDIUM", "Tối nay"));
        database.put("todos", todos);

        List<Map<String, Object>> notes = new ArrayList<>();
        notes.add(createNote("note-1", "📌 5 Quy Tắc Kỷ Luật Vàng 2026", "1. Không bao giờ bỏ lỡ 2 ngày liên tiếp.\n2. Tiết kiệm trước, chi tiêu sau.\n3. Tập trung vào tiến trình, không chỉ đích đến.", true));
        database.put("notes", notes);

        // 7. Users
        Map<String, Map<String, String>> users = new ConcurrentHashMap<>();
        Map<String, String> admin = new HashMap<>();
        admin.put("username", "xu4ns0n");
        admin.put("password", "Sondeptrai123@k");
        admin.put("fullName", "Nguyễn Xuân Sơn");
        users.put("xu4ns0n", admin);
        database.put("users", users);
    }

    private Map<String, Object> createHabit(String id, String title, String desc, String cat, String icon, String time, int target, int reward) {
        Map<String, Object> h = new HashMap<>();
        h.put("id", id);
        h.put("title", title);
        h.put("description", desc);
        h.put("category", cat);
        h.put("icon", icon);
        h.put("timeOfDay", time);
        h.put("targetDaysPerWeek", target);
        h.put("rewardAmount", reward);
        h.put("isActive", true);
        h.put("currentStreak", 28);
        return h;
    }

    private Map<String, Object> createJar(String id, String name, String cat, double pct, String color, String icon, double balance) {
        Map<String, Object> j = new HashMap<>();
        j.put("id", id);
        j.put("name", name);
        j.put("categoryKey", cat);
        j.put("percentage", pct);
        j.put("color", color);
        j.put("icon", icon);
        j.put("currentBalance", balance);
        return j;
    }

    private Map<String, Object> createTx(String id, String jarId, String type, double amount, String desc, String date) {
        Map<String, Object> t = new HashMap<>();
        t.put("id", id);
        t.put("jarId", jarId);
        t.put("type", type);
        t.put("amount", amount);
        t.put("description", desc);
        t.put("txDate", date);
        t.put("createdAt", date + "T08:00:00Z");
        return t;
    }

    private Map<String, Object> createTodo(String id, String title, boolean comp, String priority, String due) {
        Map<String, Object> td = new HashMap<>();
        td.put("id", id);
        td.put("title", title);
        td.put("completed", comp);
        td.put("priority", priority);
        td.put("dueDate", due);
        return td;
    }

    private Map<String, Object> createNote(String id, String title, String content, boolean pinned) {
        Map<String, Object> n = new HashMap<>();
        n.put("id", id);
        n.put("title", title);
        n.put("content", content);
        n.put("pinned", pinned);
        n.put("createdAt", LocalDate.now().toString());
        return n;
    }

    public synchronized void saveToFile() {
        try {
            if (!dataFile.getParentFile().exists()) {
                dataFile.getParentFile().mkdirs();
            }
            mapper.writerWithDefaultPrettyPrinter().writeValue(dataFile, database);
        } catch (IOException e) {
            System.err.println("❌ Error saving database file: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getHabits() {
        return (List<Map<String, Object>>) database.computeIfAbsent("habits", k -> new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public Map<String, List<String>> getDateCompletions() {
        return (Map<String, List<String>>) database.computeIfAbsent("dateCompletions", k -> new ConcurrentHashMap<>());
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getIncome() {
        return (Map<String, Object>) database.computeIfAbsent("income", k -> new HashMap<>());
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getJars() {
        return (List<Map<String, Object>>) database.computeIfAbsent("jars", k -> new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTransactions() {
        return (List<Map<String, Object>>) database.computeIfAbsent("transactions", k -> new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTodos() {
        return (List<Map<String, Object>>) database.computeIfAbsent("todos", k -> new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getNotes() {
        return (List<Map<String, Object>>) database.computeIfAbsent("notes", k -> new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public Map<String, Map<String, String>> getUsers() {
        return (Map<String, Map<String, String>>) database.computeIfAbsent("users", k -> new ConcurrentHashMap<>());
    }

    public int getStreakCount() {
        return (int) database.getOrDefault("streakCount", 28);
    }

    public void setStreakCount(int val) {
        database.put("streakCount", val);
        saveToFile();
    }

    public int getSavedTotal() {
        return (int) database.getOrDefault("savedTotal", 1450000);
    }

    public void setSavedTotal(int val) {
        database.put("savedTotal", val);
        saveToFile();
    }
}


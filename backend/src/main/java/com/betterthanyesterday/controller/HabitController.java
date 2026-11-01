package com.betterthanyesterday.controller;

import com.betterthanyesterday.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class HabitController {

    @Autowired
    private DataStorageService storage;

    @GetMapping("/habits")
    public ResponseEntity<Map<String, Object>> getHabits() {
        Map<String, Object> response = new HashMap<>();
        response.put("habits", storage.getHabits());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/habits")
    public ResponseEntity<Map<String, Object>> createHabit(@RequestBody Map<String, Object> body) {
        String id = "habit-" + System.currentTimeMillis();
        body.put("id", id);
        body.put("isActive", true);
        body.put("currentStreak", 0);
        storage.getHabits().add(body);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("habit", body);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/habits")
    public ResponseEntity<Map<String, Object>> deleteHabit(@RequestParam String id) {
        storage.getHabits().removeIf(h -> id.equals(h.get("id")));
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getLogs(@RequestParam(required = false) String date) {
        String queryDate = (date != null && !date.isEmpty()) ? date : LocalDate.now().toString();
        List<String> completedIds = storage.getDateCompletions().getOrDefault(queryDate, new ArrayList<>());

        Map<String, Object> response = new HashMap<>();
        response.put("completedHabitIds", completedIds);
        response.put("streakCount", storage.getStreakCount());
        response.put("savedToday", completedIds.size() * 10000);
        response.put("savedTotal", storage.getSavedTotal());

        // Simple heatmap map
        Map<String, Integer> map = new HashMap<>();
        storage.getDateCompletions().forEach((k, v) -> map.put(k, v.size()));
        response.put("completedDatesMap", map);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logs")
    public ResponseEntity<Map<String, Object>> toggleLog(@RequestBody Map<String, Object> body) {
        String habitId = (String) body.get("habitId");
        String date = (String) body.getOrDefault("date", LocalDate.now().toString());
        boolean completed = Boolean.TRUE.equals(body.get("completed"));

        List<String> list = new ArrayList<>(storage.getDateCompletions().getOrDefault(date, new ArrayList<>()));
        if (completed) {
            if (!list.contains(habitId)) list.add(habitId);
            storage.setSavedTotal(storage.getSavedTotal() + 10000);
        } else {
            list.remove(habitId);
        }
        storage.getDateCompletions().put(date, list);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }
}


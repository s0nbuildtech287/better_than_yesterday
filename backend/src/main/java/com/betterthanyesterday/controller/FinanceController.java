package com.betterthanyesterday.controller;

import com.betterthanyesterday.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @Autowired
    private DataStorageService storage;

    @GetMapping("/income")
    public ResponseEntity<Map<String, Object>> getIncome() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", storage.getIncome());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/income")
    public ResponseEntity<Map<String, Object>> updateIncome(@RequestBody Map<String, Object> body) {
        double salary = Double.parseDouble(body.getOrDefault("monthlySalary", 0).toString());
        double bonus = Double.parseDouble(body.getOrDefault("bonusIncome", 0).toString());
        String monthYear = (String) body.getOrDefault("monthYear", LocalDate.now().toString().substring(0, 7));

        Map<String, Object> income = storage.getIncome();
        income.put("monthYear", monthYear);
        income.put("monthlySalary", salary);
        income.put("bonusIncome", bonus);
        income.put("totalIncome", salary + bonus);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", income);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/jars")
    public ResponseEntity<Map<String, Object>> getJars() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", storage.getJars());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/jars")
    public ResponseEntity<Map<String, Object>> createJar(@RequestBody Map<String, Object> body) {
        String id = "jar-" + System.currentTimeMillis();
        body.put("id", id);
        body.put("currentBalance", Double.parseDouble(body.getOrDefault("currentBalance", 0).toString()));
        storage.getJars().add(body);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", body);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/jars")
    public ResponseEntity<Map<String, Object>> updateJar(@RequestBody Map<String, Object> body) {
        if (body.containsKey("singleJar")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> single = (Map<String, Object>) body.get("singleJar");
            String id = (String) single.get("id");

            for (Map<String, Object> jar : storage.getJars()) {
                if (id.equals(jar.get("id"))) {
                    if (single.containsKey("name")) jar.put("name", single.get("name"));
                    if (single.containsKey("percentage")) jar.put("percentage", Double.parseDouble(single.get("percentage").toString()));
                    if (single.containsKey("color")) jar.put("color", single.get("color"));
                    if (single.containsKey("icon")) jar.put("icon", single.get("icon"));
                    break;
                }
            }
            storage.saveToFile();
        }
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/jars")
    public ResponseEntity<Map<String, Object>> deleteJar(@RequestParam String id) {
        storage.getJars().removeIf(j -> id.equals(j.get("id")));
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getTransactions() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", storage.getTransactions());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/transactions")
    public ResponseEntity<Map<String, Object>> addTransaction(@RequestBody Map<String, Object> body) {
        String id = "tx-" + System.currentTimeMillis();
        body.put("id", id);
        String jarId = (String) body.get("jarId");
        String type = (String) body.get("type");
        double amount = Double.parseDouble(body.getOrDefault("amount", 0).toString());

        // Update jar balance
        for (Map<String, Object> jar : storage.getJars()) {
            if (jarId.equals(jar.get("id"))) {
                double curr = Double.parseDouble(jar.getOrDefault("currentBalance", 0).toString());
                double nextBal = "IN".equalsIgnoreCase(type) ? curr + amount : Math.max(0, curr - amount);
                jar.put("currentBalance", nextBal);
                break;
            }
        }

        storage.getTransactions().add(0, body);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", body);
        return ResponseEntity.ok(res);
    }
}


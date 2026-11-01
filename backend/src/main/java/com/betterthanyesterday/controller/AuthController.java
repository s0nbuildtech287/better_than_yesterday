package com.betterthanyesterday.controller;

import com.betterthanyesterday.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private DataStorageService storage;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "UP");
        res.put("service", "Better Than Yesterday Java Backend");
        res.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");

        Map<String, Object> res = new HashMap<>();
        Map<String, String> user = storage.getUsers().get(username.toLowerCase());

        if (user != null && user.get("password").equals(password)) {
            res.put("success", true);
            res.put("username", username);
            res.put("fullName", user.getOrDefault("fullName", username));
            return ResponseEntity.ok(res);
        }

        res.put("success", false);
        res.put("message", "Tài khoản hoặc mật khẩu không chính xác!");
        return ResponseEntity.status(401).body(res);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");
        String fullName = body.getOrDefault("fullName", username).trim();

        Map<String, Object> res = new HashMap<>();

        if (username.length() < 3 || password.length() < 6) {
            res.put("success", false);
            res.put("message", "Tên đăng nhập >= 3 ký tự và mật khẩu >= 6 ký tự!");
            return ResponseEntity.badRequest().body(res);
        }

        if (storage.getUsers().containsKey(username.toLowerCase())) {
            res.put("success", false);
            res.put("message", "Tên đăng nhập đã tồn tại!");
            return ResponseEntity.badRequest().body(res);
        }

        Map<String, String> newUser = new HashMap<>();
        newUser.put("username", username);
        newUser.put("password", password);
        newUser.put("fullName", fullName);
        storage.getUsers().put(username.toLowerCase(), newUser);
        storage.saveToFile();

        res.put("success", true);
        res.put("username", username);
        res.put("fullName", fullName);
        return ResponseEntity.ok(res);
    }
}


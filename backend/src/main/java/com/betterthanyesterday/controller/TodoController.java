package com.betterthanyesterday.controller;

import com.betterthanyesterday.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class TodoController {

    @Autowired
    private DataStorageService storage;

    @GetMapping("/todos")
    public ResponseEntity<Map<String, Object>> getTodos() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", storage.getTodos());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/todos")
    public ResponseEntity<Map<String, Object>> createTodo(@RequestBody Map<String, Object> body) {
        String id = "todo-" + System.currentTimeMillis();
        body.put("id", id);
        body.put("completed", false);
        storage.getTodos().add(0, body);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", body);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/todos")
    public ResponseEntity<Map<String, Object>> toggleTodo(@RequestBody Map<String, Object> body) {
        String id = (String) body.get("id");
        for (Map<String, Object> t : storage.getTodos()) {
            if (id.equals(t.get("id"))) {
                if (body.containsKey("completed")) {
                    t.put("completed", body.get("completed"));
                }
                break;
            }
        }
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/todos")
    public ResponseEntity<Map<String, Object>> deleteTodo(@RequestParam String id) {
        storage.getTodos().removeIf(t -> id.equals(t.get("id")));
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }
}


package com.betterthanyesterday.controller;

import com.betterthanyesterday.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class NoteController {

    @Autowired
    private DataStorageService storage;

    @GetMapping("/notes")
    public ResponseEntity<Map<String, Object>> getNotes() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", storage.getNotes());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, Object>> createNote(@RequestBody Map<String, Object> body) {
        String id = "note-" + System.currentTimeMillis();
        body.put("id", id);
        body.put("createdAt", LocalDate.now().toString());
        body.put("pinned", Boolean.TRUE.equals(body.get("pinned")));
        storage.getNotes().add(0, body);
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", body);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/notes")
    public ResponseEntity<Map<String, Object>> deleteNote(@RequestParam String id) {
        storage.getNotes().removeIf(n -> id.equals(n.get("id")));
        storage.saveToFile();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }
}


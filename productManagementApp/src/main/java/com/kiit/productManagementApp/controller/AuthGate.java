package com.kiit.productManagementApp.controller;
import java.util.Map;

import java.util.HashMap;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiit.productManagementApp.model.AppUser;
import com.kiit.productManagementApp.service.AuthService;
import com.kiit.productManagementApp.stores.UserRepo;

@RestController
@RequestMapping("/api/auth")
public class AuthGate {

    @Autowired private AuthService service;
    @Autowired private com.kiit.productManagementApp.security.tokenCraft tokenCraft;
    @Autowired private UserRepo repo;
    
//    public AppUser register(AppUser user) {
//        Optional<AppUser> existingUser = repo.findByEmail(user.getEmail());
//        if (existingUser.isPresent()) {
//            throw new RuntimeException("User already exists with this email.");
//        }
//
//        user.setPassword(encoder.encode(user.getPassword()));
//        user.setRole("USER");
//        return repo.save(user);
//    }
    
//    public AppUser registerAdminFun(AppUser user) {
//        Optional<AppUser> existingUser = repo.findByEmail(user.getEmail());
//        if (existingUser.isPresent()) {
//            throw new RuntimeException("User already exists with this email.");
//        }
//
//        user.setPassword(encoder.encode(user.getPassword()));
//        user.setRole("ADMIN");
//        return repo.save(user);
//    }

    
    @PostMapping("/admin/signup")
    public ResponseEntity<?> registerAdmin(@RequestBody AppUser user) {
        try {
            
            AppUser newUser = service.registerAdmin(user);
            
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {
        try {
            AppUser newUser = service.register(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }


    @Autowired private PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody AppUser user) {
        Optional<AppUser> found = service.login(user.getEmail());

        if (found.isPresent() && service.matchPassword(user.getPassword(), found.get().getPassword())) {
            String token = tokenCraft.banawoToken(found.get().getEmail(), found.get().getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }



}

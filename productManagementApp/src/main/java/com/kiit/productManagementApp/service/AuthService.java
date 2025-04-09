package com.kiit.productManagementApp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiit.productManagementApp.model.AppUser;
import com.kiit.productManagementApp.stores.UserRepo;

@Service
public class AuthService {

    @Autowired private UserRepo repo;
    @Autowired private PasswordEncoder encoder;

    public AppUser register(AppUser user) {
        Optional<AppUser> existingUser = repo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists with this email.");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("USER");
        return repo.save(user);
    }
    
    public AppUser registerAdmin(AppUser user) {
        Optional<AppUser> existingUser = repo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists with this email.");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ADMIN");
        return repo.save(user);
    }

    public Optional<AppUser> login(String email) {
        return repo.findByEmail(email);
    }
    
    public boolean matchPassword(String raw, String encoded) {
        return encoder.matches(raw, encoded);
    }


}

package com.kiit.productManagementApp.stores;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.kiit.productManagementApp.model.AppUser;

import java.util.*;

@Repository
public interface UserRepo extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}

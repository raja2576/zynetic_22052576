package com.kiit.productManagementApp.controller;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.kiit.productManagementApp.model.ProductItem;
import com.kiit.productManagementApp.service.ProductEngine;



import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/products")
public class ProductBoss {

    @Autowired
    private ProductEngine engine;

    // ✅ JWT auth wale USER or ADMIN hi product add kar sakte hain
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ProductItem create(@RequestBody ProductItem p) {
        System.out.println("Creating product: " + p);  // 🧾 Logging incoming data
        ProductItem saved = engine.saveProduct(p);
        System.out.println("Saved product: " + saved); // 🧾 Logging saved data
        return saved;
    }


    // ✅ JWT auth required - sabhi products dekhne ke liye
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ProductItem> fetchAll() {
        return engine.allProducts();
    }

    // ✅ Sirf ADMIN delete kar sakta hai koi product
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/remove/{id}")
    public void deleteKaro(@PathVariable Long id) {
        engine.hataoProduct(id);
    }

    // ✅ Update bhi auth users hi karenge
    @PutMapping("/modify")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ProductItem update(@RequestBody ProductItem p) {
        return engine.updateProduct(p);
    }

    // ✅ Filter by category - auth required
    @GetMapping("/filter/category")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ProductItem> byCat(@RequestParam String category) {
        return engine.filterByCategory(category);
    }

    // ✅ Filter by price range - auth required
    @GetMapping("/filter/price")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ProductItem> byPrice(@RequestParam Double min, @RequestParam Double max) {
        return engine.priceRange(min, max);
    }

    // ✅ Filter by rating - auth required
    @GetMapping("/filter/rating")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ProductItem> byRating(@RequestParam Double rate) {
        return engine.ratingAtLeast(rate);
    }

    // ✅ Search functionality - auth required
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ProductItem> bySearch(@RequestParam String text) {
        return engine.searchByText(text);
    }

//    @GetMapping("/image/{filename:.+}")
//    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
//        Path imagePath = Paths.get("uploads").resolve(filename).normalize();
//
//        if (!Files.exists(imagePath)) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Resource resource = new UrlResource(imagePath.toUri());
//        return ResponseEntity.ok()
//        		.contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
// // or use MediaTypeFactory if images can be PNG, JPG, etc.
//            .body(resource);
//    }

    
//    /
//    @GetMapping("/image/{filename:.+}")
//    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
//        Path imagePath = Paths.get("uploads").resolve(filename).normalize();
//        Resource resource = new UrlResource(imagePath.toUri());
//
//        if (!resource.exists()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.IMAGE_JPEG) // or detect content type dynamically
//                .body(resource);
//    }

}

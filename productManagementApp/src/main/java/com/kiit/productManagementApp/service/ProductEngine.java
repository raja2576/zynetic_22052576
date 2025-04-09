package com.kiit.productManagementApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiit.productManagementApp.model.ProductItem;
import com.kiit.productManagementApp.stores.ProductRepo;

import java.util.*;

@Service
public class ProductEngine {

    @Autowired private ProductRepo repo;

    public ProductItem saveProduct(ProductItem p) {
        return repo.save(p);
    }

    public List<ProductItem> allProducts() {
        return repo.findAll();
    }

    public void hataoProduct(Long id) {
        repo.deleteById(id);
    }

    public ProductItem updateProduct(ProductItem p) {
        return repo.save(p);
    }

    public List<ProductItem> filterByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<ProductItem> priceRange(Double min, Double max) {
        return repo.findByPriceBetween(min, max);
    }

    public List<ProductItem> ratingAtLeast(Double rate) {
        return repo.findByRatingGreaterThanEqual(rate);
    }

    public List<ProductItem> searchByText(String text) {
        return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(text, text);
    }
}

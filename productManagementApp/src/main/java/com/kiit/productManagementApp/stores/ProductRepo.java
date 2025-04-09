package com.kiit.productManagementApp.stores;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kiit.productManagementApp.model.ProductItem;

@Repository
public interface ProductRepo extends JpaRepository<ProductItem, Long> {
    List<ProductItem> findByCategory(String category);
    List<ProductItem> findByPriceBetween(Double min, Double max);
    List<ProductItem> findByRatingGreaterThanEqual(Double rating);
    List<ProductItem> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String desc);
}

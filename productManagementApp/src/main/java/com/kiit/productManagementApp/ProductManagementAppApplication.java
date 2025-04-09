package com.kiit.productManagementApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableMethodSecurity
@SpringBootApplication
public class ProductManagementAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductManagementAppApplication.class, args);
	}
 
}

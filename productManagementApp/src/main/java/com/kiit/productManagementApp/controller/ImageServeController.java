package com.kiit.productManagementApp.controller;


import org.springframework.core.io.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.*;

@RestController
@RequestMapping("/api/products/image")
public class ImageServeController {

 @GetMapping("/{filename}")
 public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
     File file = new File("uploads/" + filename);

     if (!file.exists()) {
         return ResponseEntity.notFound().build();
     }

     Resource resource = new FileSystemResource(file);

     // 🧠 MimeType guess karo based on file extension
     MediaType mediaType = MediaTypeFactory.getMediaType((Resource) file)
             .orElse(MediaType.APPLICATION_OCTET_STREAM);

     return ResponseEntity.ok()
             .contentType(mediaType)
             .body(resource);
 }
}

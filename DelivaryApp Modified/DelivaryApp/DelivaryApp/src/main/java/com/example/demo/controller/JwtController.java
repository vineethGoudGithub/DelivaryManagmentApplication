package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.security.JwtUtil;
@RestController("/api")
public class JwtController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/generate-token")
    public String generateToken() {
        return jwtUtil.generateToken("vineeth", null);
    }
}

package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;

   
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.enu.Role;

public interface UserService {
    User signUp(String email, String password, String phoneNumber, Role role);
    boolean login(String email, String password, Role role);
    User getUserByEmail(String email);
    boolean hasRole(String email, Role role);
}

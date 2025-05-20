package com.example.demo.repo;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.User;
@Repository 
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailAndPhoneNumber(String email, String phoneNumber);
    Optional<User> findByEmail(String email);


}

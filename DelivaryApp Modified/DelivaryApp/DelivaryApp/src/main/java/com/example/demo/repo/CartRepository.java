package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.CartItem;
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomerEmail(String email);
    void deleteByCustomerEmailAndProductId(String email, Long productId);

    Optional<CartItem> findByCustomerEmailAndProductId(String email, Long productId); // ✅ Add this
}

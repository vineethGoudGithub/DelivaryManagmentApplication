package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CartRequest;
import com.example.demo.entity.CartItem;
import com.example.demo.repo.CartRepository;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        Long productId = request.getProductId();
        String customerEmail = request.getCustomerEmail();

        // Validate quantity
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than zero.");
        }
        int quantityToAdd = request.getQuantity();
        System.out.println("Add to cart: " + customerEmail + " - " + productId + " - " + quantityToAdd);

        String productName = productService.getProductNameById(productId);
        String description = productService.getProductDescriptionById(productId);

        if (productName == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        Optional<CartItem> optionalCartItem = cartRepository.findByCustomerEmailAndProductId(customerEmail, productId);

        if (optionalCartItem.isPresent()) {
            CartItem existingItem = optionalCartItem.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantityToAdd);
            cartRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(customerEmail, productId, quantityToAdd, productName, description);
            cartRepository.save(newItem);
        }

        return ResponseEntity.ok("Added to cart");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeItem(@RequestParam String email, @RequestParam Long productId) {
        cartRepository.deleteByCustomerEmailAndProductId(email, productId);
        return ResponseEntity.ok("Item removed.");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartQuantity(@RequestBody CartRequest request) {
        Long productId = request.getProductId();
        String customerEmail = request.getCustomerEmail();

        // Validate quantity
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than zero.");
        }
        int quantity = request.getQuantity();

        Optional<CartItem> optionalCartItem = cartRepository.findByCustomerEmailAndProductId(customerEmail, productId);

        if (optionalCartItem.isPresent()) {
            CartItem item = optionalCartItem.get();
            item.setQuantity(quantity);
            cartRepository.save(item);
            return ResponseEntity.ok("Cart updated");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }
    }

    @GetMapping("/{email}")
    public List<CartItem> getCart(@PathVariable String email) {
        return cartRepository.findByCustomerEmail(email);
    }
}

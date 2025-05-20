package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.repo.OrderRepository;
import com.example.demo.repo.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
    	Long productId=order.getProductId();
    	
         boolean productExist = productRepository.existsById(productId);
    	
         if(!productExist) {
        	 throw new IllegalArgumentException("Invalid Product Id "+productId);
         }
         else {
        order.setStatus("Pending"); 
        return orderRepository.save(order);
         }
    }

    
    
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            return orderRepository.save(order);
        } else {
            throw new IllegalArgumentException("Order not found with id: " + orderId);
        }
    }


}


package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

     @Transactional
    public Product updateProduct(Product updatedProduct) {
   
        Optional<Product> existingProductOptional = productRepository.findById(updatedProduct.getId());

        if (existingProductOptional.isEmpty()) {
            throw new IllegalArgumentException("Product not found");
        }

        Product existingProduct = existingProductOptional.get();
        
      
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());

     
        return productRepository.save(existingProduct);
    }
     

     public String getProductNameById(Long productId) {
         Product product = productRepository.findById(productId).orElse(null);
         return product != null ? product.getName() : null;
     }

     public String getProductDescriptionById(Long productId) {
         Product product = productRepository.findById(productId).orElse(null);
         return product != null ? product.getDescription() : null;
     }

     public boolean isProductExist(Long productId) {
         return productRepository.existsById(productId);
     }

}

package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;
    private Long productId;
    private Integer quantity;
    private String productName;
    private String productDescription;

    // ✅ Add this version field
    @Version
    private Long version;

    public CartItem() {
    }

    public CartItem(String customerEmail, Long productId, Integer quantity, String productName, String productDescription) {
        this.customerEmail = customerEmail;
        this.productId = productId;
        this.quantity = quantity;
        this.productName = productName;
        this.productDescription = productDescription;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}

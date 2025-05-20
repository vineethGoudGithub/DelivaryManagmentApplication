package com.example.demo.dto;

public class CartRequest {
    private Long productId;
    private Integer quantity;
    private String customerEmail;

 
    public CartRequest() {}

    public CartRequest(Long productId, Integer quantity, String customerEmail) {
        this.productId = productId;
        this.quantity = (quantity != null && quantity > 0) ? quantity : 1; 
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
        if (quantity != null && quantity > 0) {
            this.quantity = quantity;
        } else {
            this.quantity = 1; 
        }
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}

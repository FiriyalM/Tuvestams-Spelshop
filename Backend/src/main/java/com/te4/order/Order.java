/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.order;

import javax.ejb.Stateless;

/**
 *
 * @author Mohame Nader Alhamwi
 */
public class Order {
    private String userName;
    private int orderId;
    private int productId;
    private int amountPurchased;
    private String purchaseDate;

    public Order(String userName, int orderId, int productId, int amountPurchased, String purchaseDate) {
        this.userName = userName;
        this.orderId = orderId;
        this.productId = productId;
        this.amountPurchased = amountPurchased;
        this.purchaseDate = purchaseDate;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getAmountPurchased() {
        return amountPurchased;
    }

    public void setAmountPurchased(int amountPurchased) {
        this.amountPurchased = amountPurchased;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}
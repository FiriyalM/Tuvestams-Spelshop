/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.order;

import java.sql.Array;
import java.util.List;

/**
 *
 * @author Elev
 */
public class OrderList {
    private String userName;
    private List orders;
    private int orderId;
    private String purchaseDate;
    private int productId;
    private int amountPurchased;
    private String productName;
    private String consoleType;
    private String imagePath;
    private String price;
    
    public OrderList(int orderId, String purchaseDate) {
        this.orderId = orderId;
        this.purchaseDate = purchaseDate;
    }

    public OrderList(int productId, int amountPurchased, String productName ,String consoleType, String imagePath, String price) {
        this.productId = productId;
        this.amountPurchased = amountPurchased;
        this.productName = productName;
        this.consoleType = consoleType;
        this.imagePath = imagePath;
        this.price = price;
    }

        
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    

    public List getOrders() {
        return orders;
    }

    public void setOrders(List orders) {
        this.orders = orders;
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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getConsoleType() {
        return consoleType;
    }

    public void setConsoleType(String consoleType) {
        this.consoleType = consoleType;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}

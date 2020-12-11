/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.order;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.te4.backend.ConnectionFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;

/**
 *
 * @author Mohame Nader Alhamwi
 */
@Stateless
public class OrderBean {
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method POST 
     * metoden sparar en order information i databasen
     * */
    public int createOrder(Order order){
        try (Connection con = ConnectionFactory.getConnection()){
           String createOrder = "INSERT INTO `order`(`customerNumber`, `orderId`, `productId`, `amountPurchased`, `purchaseDate`) "
                   + "VALUES (?,?,?,?,?)";
           PreparedStatement pstmt = con.prepareStatement(createOrder);
           pstmt.setInt(1,order.getCustomerNumber());
           pstmt.setInt(2,order.getOrderId());
           pstmt.setInt(3, order.getProductId());
           pstmt.setInt(4, order.getAmountPurchased());
           pstmt.setString(5, order.getPurchaseDate());
           int rows = pstmt.executeUpdate();
           return rows;
       } catch (Exception e) {
           System.out.println("Error OrderBean.createOrder: " +e.getMessage());
           return 0;
       }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method DELETE 
     * metoden tarbort en order från databasen med hjälp av orderId
     * */
    public int deleteOrder(Order order){
        try (Connection con = ConnectionFactory.getConnection()){
            String deleteProductData = "DELETE FROM `order` WHERE orderId=?";
            PreparedStatement pstmt = con.prepareStatement(deleteProductData);
            pstmt.setInt(1, order.getOrderId());
            int rows = pstmt.executeUpdate();
            return rows;
        } catch (Exception e) {
            System.out.println("Error OrderBean.deleteOrder: " +e.getMessage());
            return 0;
        }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method PUT
     * metoden updatera en order information i databasen
     * */
    public int updateOrder(Order order){
        try (Connection con = ConnectionFactory.getConnection()){
           String updateOrderData = "UPDATE `order` SET `customerNumber`=?,`orderId`=?,`productId`=?,`amountPurchased`=?,`purchaseDate`=? WHERE orderId=?";
           PreparedStatement pstmt = con.prepareStatement(updateOrderData);
           pstmt.setInt(1,order.getCustomerNumber());
           pstmt.setInt(2,order.getOrderId());
           pstmt.setInt(3, order.getProductId());
           pstmt.setInt(4, order.getAmountPurchased());
           pstmt.setString(5, order.getPurchaseDate());
           pstmt.setInt(6,order.getOrderId());
           int rows = pstmt.executeUpdate();
           return rows;
       } catch (Exception e) {
           System.out.println("Error ProductBean.updateOrder: " +e.getMessage());
           return 0;
       }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method GET 
     * metoden Söker efter order med hjälp av !!
     * */
    public List<Order> showOrder (Order order){
        List<Order> orderData = new ArrayList<Order>();
        try (Connection con = ConnectionFactory.getConnection()){
           String createProduct = "";
            PreparedStatement stmt = con.prepareStatement(createProduct);
            ResultSet data = stmt.executeQuery();
            while(data.next()){
                
                
                //Order newOrder = new Order();
                
                //orderData.add(newOrder);
                /*int productId = data.getInt("productId");
                String productName = data.getString("productName");
                String consoleType = data.getString("consoleType");
                String info = data.getString("info");
                String price = data.getString("price");
                String imgPath = data.getString("imgPath");
                int amountInStock = data.getInt("amountInStock");
                
                Product newProduct = new Product(productId,productName,consoleType,info,price,imgPath,amountInStock);
                
                productData.add(newProduct);*/
            }
            return orderData;
        } catch (Exception e) {
           System.out.println("Error OrderBean.showOrder: " +e.getMessage());
            return null;
        }
    }
}

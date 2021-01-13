/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.order;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.te4.backend.ConnectionFactory;
import com.te4.user.User;
import com.te4.user.UserInfo;
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
    static long orders = 0;
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method POST 
     * metoden sparar en order information i databasen
     * */
    //skapa en for lopp där den gå igenom alla ordrar.
    public int createOrder(Order[] order){
        long orderId = orders++;
        
        try (Connection con = ConnectionFactory.getConnection()){
           String createOrder = "INSERT INTO `order`( `customerNumber`, `orderId`, `productId`, `amountPurchased`, `purchaseDate` ) "
                   + "VALUES( ( SELECT `customerNumber` FROM `userinfo` WHERE `userName` = ? ), ?, ?, ?, ?)";
            int rows = 0 ;
            for (int i = 0; i < order.length; i++) {
                PreparedStatement pstmt = con.prepareStatement(createOrder);
                pstmt.setString(1, order[i].getUserName());
                pstmt.setLong(2, orderId); 
                pstmt.setInt(3, order[i].getProductId());
                pstmt.setInt(4, order[i].getAmountPurchased());
                pstmt.setString(5, order[i].getPurchaseDate());
               
                rows += pstmt.executeUpdate();
            } 
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
           String updateOrderData = "UPDATE `order` SET `productId`=?,`amountPurchased`=?,`purchaseDate`=? WHERE orderId=?";
           PreparedStatement pstmt = con.prepareStatement(updateOrderData);
           
           pstmt.setInt(1, order.getProductId());
           pstmt.setInt(2, order.getAmountPurchased());
           pstmt.setString(3, order.getPurchaseDate());
           pstmt.setInt(4,order.getOrderId());
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
    public List<Object> showOrder (User user){
        List<Object> orderData = new ArrayList<>();
        try (Connection con = ConnectionFactory.getConnection()){
            
           String showOrders = "SELECT "
                   + "(ORDER.customerNumber), "
                   + "(ORDER.orderId), "
                   + "(ORDER.productId), "
                   + "(ORDER.amountPurchased), "
                   + "(ORDER.purchaseDate) "
                   + "FROM `order` JOIN `userInfo` ON(ORDER.customerNumber) =(userinfo.customerNumber) WHERE `userName` =? ";
           
            PreparedStatement stmt = con.prepareStatement(showOrders);
            stmt.setString(1, user.getUserName());
            ResultSet data = stmt.executeQuery();
            
            while(data.next()){
                String customerNumber = data.getString("customerNumber");
                int orderId = data.getInt("orderId");
                int productId = data.getInt("productId");
                int amountPurchased = data.getInt("amountPurchased");
                String purchaseDate = data.getString("purchaseDate");
                
                Order newOrder = new Order(customerNumber, orderId, productId, amountPurchased, purchaseDate);
                orderData.add(newOrder);
            }
            
            String getUserInfo = "SELECT `email`, `phoneNumber`, `address`, `zipCode`, `city` FROM `userInfo` WHERE `userName`=?";
            stmt = con.prepareStatement(getUserInfo);
            stmt.setString(1, user.getUserName());
            data = stmt.executeQuery();
            
            data.next();
            
            String email = data.getString("email");
            String phoneNumber = data.getString("phoneNumber");
            String addres = data.getString("address");
            int zipCode = data.getInt("zipCode");
            String city = data.getString("city");
            
            UserInfo userInfo = new UserInfo(email,addres,city, zipCode, phoneNumber);
            orderData.add(userInfo);//
            
            return orderData;
        } catch (Exception e) {
           System.out.println("Error OrderBean.showOrder: " +e.getMessage());
            return null;
        }
    }
}

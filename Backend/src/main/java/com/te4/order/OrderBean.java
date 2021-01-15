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
     *
     * @param orderList
     * @return  */
    public List<Object> showOrder (OrderList orderList){
        List<Object> orderData = new ArrayList<>();
        List<Object> allOrderData = new ArrayList<>();
        List<Object> allProductInorder = new ArrayList<>();
        try (Connection con = ConnectionFactory.getConnection()){
            
           String showOrders = "SELECT "
                   + "(ORDER.customerNumber), "
                   + "(ORDER.orderId), "
                   + "(ORDER.productId), "
                   + "(ORDER.amountPurchased), "
                   + "(ORDER.purchaseDate) "
                   + "FROM `order` JOIN `userInfo` ON(ORDER.customerNumber) =(userinfo.customerNumber) WHERE `userName` =? ";
           
            PreparedStatement stmt = con.prepareStatement(showOrders);
            stmt.setString(1, orderList.getUserName());
            //spaarar order info i orderResData
            ResultSet orderResData = stmt.executeQuery();
            
            //hämtar användarens info
            String getUserInfo = "SELECT `email`, `phoneNumber`, `address`, `zipCode`, `city` FROM `userInfo` WHERE `userName`=?";
            stmt = con.prepareStatement(getUserInfo);
            stmt.setString(1, orderList.getUserName());
            //sparar user info i userRsData
            ResultSet userRsData = stmt.executeQuery();

            userRsData.next();

            String email = userRsData.getString("email");
            String phoneNumber = userRsData.getString("phoneNumber");
            String addres = userRsData.getString("address");
            int zipCode = userRsData.getInt("zipCode");
            String city = userRsData.getString("city");
            
            while(orderResData.next()){
               String getProductInfo = "SELECT `productName`,`consoleType`, `price`, `imgPath` FROM `product` WHERE productId = ?";
               stmt = con.prepareStatement(getProductInfo);
               stmt.setInt(1, orderResData.getInt("productId"));
               //sparar productens info i productRsData
               ResultSet productRsData = stmt.executeQuery();

               productRsData.next();

               String productName = productRsData.getString("productName");
               String consoleType = productRsData.getString("consoleType");
               String price = productRsData.getString("price");
               String imagePath = productRsData.getString("imgPath");
               
                //String customerNumber = data.getString("customerNumber");
                int orderId = orderResData.getInt("orderId");
                int productId = orderResData.getInt("productId");
                int amountPurchased = orderResData.getInt("amountPurchased");
                String purchaseDate = orderResData.getString("purchaseDate");
                
                //spara alla info i listn
                OrderList order = new OrderList(orderId, purchaseDate);
                OrderList ProductInfo = new OrderList(productId, amountPurchased,productName, consoleType, imagePath, price);
                
                allProductInorder.add(ProductInfo);
                orderData.add(order);
                orderData.add(allProductInorder);

            }
                UserInfo userInfo = new UserInfo(orderList.getUserName(), email, addres, city, zipCode, phoneNumber, orderData);
                allOrderData.add(userInfo);
                
            return allOrderData;
        } catch (Exception e) {
           System.out.println("Error OrderBean.showOrder: " +e.getMessage());
            return null;
        }
    }
}


/*
        "orders":
        [
            "orderId": 2,
            "purchaseDate": "2027-01-12"
            "products": 
            [
                {
                    "amountPurchased": 5,
                    "consoleType": "PC",
                    "imagePath": "img",
                    "price": "199",
                    "productId": 6,
                    "productName": "Minecraft",
                },
                {
                    "amountPurchased": 5,
                    "consoleType": "PC",
                    "imagePath": "img",
                    "price": "199",
                    "productId": 6,
                    "productName": "Minecraft",
                }
            ]   
            "orderId": 0,
            "purchaseDate": "2027-01-12"
            "products": 
            [
                {
                    "amountPurchased": 5,
                    "consoleType": "PC",
                    "imagePath": "img",
                    "price": "199",
                    "productId": 6,
                    "productName": "Minecraft",
                },
                {
                    "amountPurchased": 5,
                    "consoleType": "PC",
                    "imagePath": "img",
                    "price": "199",
                    "productId": 6,
                    "productName": "Minecraft",
                }
            ]
        ]


*/
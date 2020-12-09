/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.product;

import com.te4.backend.ConnectionFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.ejb.Stateless;

/**
 *
 * @author Elev
 */
@Stateless
public class ProductBean {
    public int addProduct(Product product){
         try (Connection con = ConnectionFactory.getConnection()){
           String createProduct = "INSERT INTO `product`(`productName`, `consoleType`, `info`, `price`, `imgPath`, `amountInStock`) "
                   + "VALUES (?,?,?,?,?,?)";
           PreparedStatement pstmt = con.prepareStatement(createProduct);
           pstmt.setString(1, product.getProductName());
             System.out.println(product.getInfo());
             System.out.println(product.getPrice());
             System.out.println(product.getImagePath());
             System.out.println(product.getAmountInStock());
           pstmt.setString(2,  product.getConsoleType());
           pstmt.setString(3, product.getInfo());
           pstmt.setString(4, product.getPrice());
           pstmt.setString(5, product.getImagePath());
           pstmt.setInt(6, product.getAmountInStock());
           int rows = pstmt.executeUpdate(createProduct);
           return rows;
       } catch (Exception e) {
           System.out.println("Error ProductBean.addProduct: " +e.getMessage());
           return 0;
       }
    }
}

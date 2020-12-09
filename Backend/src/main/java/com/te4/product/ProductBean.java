/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.product;

import com.te4.backend.ConnectionFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;

/**
 *
 * @author Elev
 */
@Stateless
public class ProductBean {
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method POST 
     * metoden sparar en product information i databasen
     * */
    public int addProduct(Product product){
         try (Connection con = ConnectionFactory.getConnection()){
           String createProduct = "INSERT INTO `product`(`productName`, `consoleType`, `info`, `price`, `imgPath`, `amountInStock`) "
                   + "VALUES (?,?,?,?,?,?)";
           PreparedStatement pstmt = con.prepareStatement(createProduct);
           pstmt.setString(1, product.getProductName());
           pstmt.setString(2,  product.getConsoleType());
           pstmt.setString(3, product.getInfo());
           pstmt.setString(4, product.getPrice());
           pstmt.setString(5, product.getImagePath());
           pstmt.setInt(6, product.getAmountInStock());
           int rows = pstmt.executeUpdate();
           return rows;
       } catch (Exception e) {
           System.out.println("Error ProductBean.addProduct: " +e.getMessage());
           return 0;
       }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method DELETE 
     * metoden tarbort en product från databasen med hjälp av productId
     * */
    public int deleteProduct(Product product){
        try (Connection con = ConnectionFactory.getConnection()){
           String deleteProductData = "DELETE FROM `product` WHERE productId=?";
           PreparedStatement pstmt = con.prepareStatement(deleteProductData);
           pstmt.setInt(1, product.getProductId());
           int rows = pstmt.executeUpdate();
           return rows;
       } catch (Exception e) {
           System.out.println("Error ProductBean.deleteProduct: " +e.getMessage());
           return 0;
       }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product , Method PUT 
     * metoden updatera en product information i databasen
     * */
    public int updateProduct(Product product){
     try (Connection con = ConnectionFactory.getConnection()){
           String updateProductData = "UPDATE `product` SET `productName`=?,`consoleType`=?,`info`=?,`price`=?,`imgPath`=?,`amountInStock`=? WHERE productId=?";
           PreparedStatement pstmt = con.prepareStatement(updateProductData);
           pstmt.setString(1, product.getProductName());
           pstmt.setString(2, product.getConsoleType());
           pstmt.setString(3, product.getInfo());
           pstmt.setString(4, product.getPrice());
           pstmt.setString(5, product.getImagePath());
           pstmt.setInt(6, product.getAmountInStock());
           pstmt.setInt(7, product.getProductId());
           int rows = pstmt.executeUpdate();
           return rows;
       } catch (Exception e) {
           System.out.println("Error ProductBean.updateProduct: " +e.getMessage());
           return 0;
       }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product/search/ProductName , Method GET 
     * metoden söker efter en product med hjälp av productName
     * */
     public List<Product> searchProductByProductName(Product product){
          List<Product> productData = new ArrayList<Product>();
         try (Connection con = ConnectionFactory.getConnection()){
           String createProduct = "SELECT * FROM `product` WHERE productName=?";
            PreparedStatement stmt = con.prepareStatement(createProduct);
            stmt.setString(1, product.getProductName());
            ResultSet data = stmt.executeQuery();
            while(data.next()){
                int productId = data.getInt("productId");
                String productName = data.getString("productName");
                String consoleType = data.getString("consoleType");
                String info = data.getString("info");
                String price = data.getString("price");
                String imgPath = data.getString("imgPath");
                int amountInStock = data.getInt("amountInStock");
                
                Product newProduct = new Product(productId,productName,consoleType,info,price,imgPath,amountInStock);
                
                productData.add(newProduct);
            }
            return productData;
        } catch (Exception e) {
           System.out.println("Error ProductBean.searchProductByProductName: " +e.getMessage());
            return null;
        }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/product/search/ConsoleType , Method GET 
     * metoden söker en product med hjälp av consoleType
     * */
    public List<Product> searchProductByConsoleType(Product product){
          List<Product> productData = new ArrayList<Product>();
         try (Connection con = ConnectionFactory.getConnection()){
           String createProduct = "SELECT * FROM `product` WHERE consoleType=?";
            PreparedStatement stmt = con.prepareStatement(createProduct);
            stmt.setString(1, product.getConsoleType());
            ResultSet data = stmt.executeQuery();
            while(data.next()){
                int productId = data.getInt("productId");
                String productName = data.getString("productName");
                String consoleType = data.getString("consoleType");
                String info = data.getString("info");
                String price = data.getString("price");
                String imgPath = data.getString("imgPath");
                int amountInStock = data.getInt("amountInStock");
                
                Product newProduct = new Product(productId,productName,consoleType,info,price,imgPath,amountInStock);
                
                productData.add(newProduct);
            }
            return productData;
        } catch (Exception e) {
           System.out.println("Error ProductBean.searchProductByConsoleType: " +e.getMessage());
            return null;
        }
    }
}

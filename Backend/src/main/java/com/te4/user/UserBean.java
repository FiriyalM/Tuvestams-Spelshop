/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.user;

import com.te4.backend.ConnectionFactory;
import at.favre.lib.crypto.bcrypt.BCrypt;
import javax.ejb.Stateless;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Base64;

/**
 *
 * @author Mohame Nader Alhamwi
 */
@Stateless
public class UserBean {
    /**/
    public User createUser(String auth){
        auth = auth.substring(6).trim();
        byte[] bytes = Base64.getDecoder().decode(auth);
        auth = new String(bytes);
        int colon = auth.indexOf(":");
        String userName = auth.substring(0, colon);
        String password = auth.substring(colon+1);
        return new User(userName, password);
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method GET 
     * metoden kollar om userName och password fins i databasen.
     * */
    public boolean logInUser(User user){
        try (Connection con = ConnectionFactory.getConnection()){
            
            String sql = "SELECT * FROM user WHERE userName=?";
            
            PreparedStatement stmt = con.prepareStatement(sql);
            stmt.setString(1, user.getUserName());
            ResultSet data = stmt.executeQuery();
            
            if(data.next()){
                String bcryptHashString = data.getString("password");
                BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), bcryptHashString);
                
                return result.verified;
            }else{
                return false;
            }
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method POST 
     * metoden sparar anvädndare information
     * */
    public int saveUser(User user, UserInfo userInfo){
       try (Connection con = ConnectionFactory.getConnection()){
           
           String hashedpassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
           
           String insertUser = String.format("INSERT INTO user VALUES ('%s','%s', '%s');", user.getUserName(), hashedpassword, 0);
           String insertUserInfo = String.format("INSERT INTO userinfo(userName, email, phoneNumber, address, zipCode, city) "
                   + "VALUES ('%s','%s', '%s', '%s', '%d','%s');",
                   userInfo.getUserName(), 
                   userInfo.getEmail(),
                   userInfo.getPhoneNumber(), 
                   userInfo.getAddress(), 
                   userInfo.getZipCode(), 
                   userInfo.getCity() );
           
           PreparedStatement stmt = con.prepareStatement(insertUser + insertUserInfo);
           int rows = stmt.executeUpdate(insertUser);
           rows += stmt.executeUpdate(insertUserInfo);
           return rows;
       } catch (Exception e) {
           System.out.println("Error UserBean.saveUser: " +e.getMessage());
           return 0;
       }
   }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method DELETE 
     * metoden tarbort användare med hjälp av userName
     * */
   public int deleteUser(User user){
       try (Connection con = ConnectionFactory.getConnection()){
           
           String deleteUser = String.format("DELETE FROM user WHERE userName = ('%s')", user.getUserName());
           
           PreparedStatement pstmt = con.prepareStatement(deleteUser);
           int rows = pstmt.executeUpdate(deleteUser);
           return rows;
       } catch (Exception e) {
           System.out.println("Error UserBean.deleteUser: " +e.getMessage());
           return 0;
       }
    }
   
   /**
    * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method PUT 
    * metoden ändrar på användarens lösenord 
    * */
   public int changepassword(User user){
       try (Connection con = ConnectionFactory.getConnection()){
           
           String hashedpassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
            
           String deleteUser = String.format("UPDATE user SET password='%s' WHERE userName='%s'",hashedpassword, user.getUserName() );
           
           PreparedStatement pstmt = con.prepareStatement(deleteUser);
           
           int rows = pstmt.executeUpdate(deleteUser);
           return rows;
       } catch (Exception e) {
           System.out.println("Error UserBean.changepassword: " +e.getMessage());
           return 0;
       }
   }
   
   /**
   * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user/updateUser , Method PUT 
   * metoden ändrar på användarens information med hjälp av userName och password
    * */
   public int changeUserData(User user, UserInfo userInfo){
       try (Connection con = ConnectionFactory.getConnection()){
           
           String hashedpassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
           
           String uppdateUser = String.format("UPDATE user SET "
                   + "userName='%s', password='%s', adminStatus='%s' WHERE userName='%s';",
                   user.getUserName(), 
                   hashedpassword, 0, 
                   user.getUserName());
           
           String updateUserInfo = String.format("UPDATE userinfo SET "
                   + "email='%s', phoneNumber='%s', address='%s', zipCode='%d', city='%s'  "
                   + "WHERE userName='%s';", 
                   userInfo.getEmail(), 
                   userInfo.getPhoneNumber(), 
                   userInfo.getAddress(), 
                   userInfo.getZipCode(), 
                   userInfo.getCity(), 
                   user.getUserName());
           
           PreparedStatement stmt = con.prepareStatement(uppdateUser + updateUserInfo);
           int rows = stmt.executeUpdate(uppdateUser);
           rows += stmt.executeUpdate(updateUserInfo);
           return rows;
       } catch (Exception e) {
           System.out.println("Error UserBean.changeUserData: " +e.getMessage());
           return 0;
       }
   }
  
   /*
   * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user/searchUser , Method GET 
   * den hämtar alla användarens införmation när admin söker efter en användare på sin userName
   */
   public int searchUser(User user, UserInfo userInfo){
       try (Connection con = ConnectionFactory.getConnection()){
           
            String sql = "SELECT * FROM user WHERE userName=?";
            String sql2 = "SELECT * FROM userInfo WHERE userName=?";
            
            PreparedStatement stmt = con.prepareStatement(sql2);
            stmt.setString(1, user.getUserName());
            ResultSet data = stmt.executeQuery();
            
            while(data.next()){
                System.out.println(userInfo.getUserName());
                //visa användarens införmation
            }
            
            return 1;
        } catch (Exception e) {
            return 0;
        }
   }
}

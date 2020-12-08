/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.user;

/**
 *
 * @author Elev
 */
public class UserInfo {
    private int customerNumber;
    private String userName;
    private String email;
    private String address;
    private String city;
    private int zipCode;
    private String phoneNumber;

    public UserInfo(int customerNumber, String userName, String email, String adress, String city, int zipCode, String phoneNumber) {
        this.customerNumber = customerNumber;
        this.userName = userName;
        this.email = email;
        this.address = adress;
        this.city = city;
        this.zipCode = zipCode;
        this.phoneNumber = phoneNumber;
    }

    public UserInfo(String userName, String email, String adress, String city, int zipCode, String phoneNumber) {
        this.userName = userName;
        this.email = email;
        this.address = adress;
        this.city = city;
        this.zipCode = zipCode;
        this.phoneNumber = phoneNumber;
    }

      
    
    public int getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(int customerNumber) {
        this.customerNumber = customerNumber;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    
    
}
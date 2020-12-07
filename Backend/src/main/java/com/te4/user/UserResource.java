/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.user;

import com.google.gson.Gson;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Elev
 */
@Path("user")
public class UserResource {
    
    @EJB
    UserBean userBean;
    
    @GET
    public Response logInUser(@HeaderParam("Authorization") String userData){
        User user = userBean.createUser(userData);
        if(userBean.logInUser(user)){
            return Response.ok("Welcome to our sectrer res api").build();
        }else{
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
     }
    
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createUser(String userData){
        Gson gson = new Gson();
        User user = gson.fromJson(userData, User.class);
        UserInfo userInfo = gson.fromJson(userData, UserInfo.class);
        if(userBean.saveUser(user, userInfo) == 2){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    
    @PUT
    @Consumes(MediaType.TEXT_PLAIN)
    public Response changePassword(String userData){
        Gson gson = new Gson();
        User user = gson.fromJson(userData, User.class);
        if(userBean.changepassword(user) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @PUT
    @Path("updateUser")
    @Consumes(MediaType.TEXT_PLAIN)
    public Response changeUserData(String userData){
        Gson gson = new Gson();
        User user = gson.fromJson(userData, User.class);
        UserInfo userInfo = gson.fromJson(userData, UserInfo.class);
        if(userBean.changeUserData(user, userInfo) == 2){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @DELETE
    public Response deleteUser(@HeaderParam("user") String userName){;
        Gson gson = new Gson();
        User user = gson.fromJson(userName, User.class);
        if(userBean.deleteUser(user) == 1){
           return Response.ok().build();
        }else{
            
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    /*
    @GET
    @Consumes(MediaType.TEXT_PLAIN)
    public Response searchUser(){}
    */
}

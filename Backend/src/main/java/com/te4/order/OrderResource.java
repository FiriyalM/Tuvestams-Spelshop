/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.order;

import com.google.gson.Gson;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
@Path("order")
public class OrderResource {
    
    @EJB
    OrderBean orderBean;
    
    /**
     * den här metoden skapar en ny order
     * den tar emot informationen på detta viset
     * {"customerNumber":24, 
     * "orderId":1, 
     * "productId":6,
     * "amountPurchased":1,
     * "purchaseDate":"2020-08-03"}
     * */
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createOrder(String orderData){
        Gson gson = new Gson();
        Order order = gson.fromJson(orderData, Order.class);
        if(orderBean.createOrder(order) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    /**
     * den här metoden tar bort en order
     * det tar emot informationen på detta viset
     * {"orderId":"1"}
     * */
    @DELETE
    public Response deleteOrder(@HeaderParam("orderId")String orderId){
        Gson gson = new Gson();
        Order order = gson.fromJson(orderId, Order.class);
        if(orderBean.deleteOrder(order) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    /**
     * den här metoden ändrar på en order information
     * den tar emot informationen på detta viset
     * {"customerNumber":24, 
     * "orderId":1, 
     * "productId":3,
     * "amountPurchased":1,
     * "purchaseDate":"2020-08-03"}
     * */
    @PUT
    @Consumes(MediaType.TEXT_PLAIN)
    public Response changeOrder(String orderData){
        Gson gson = new Gson();
        Order order = gson.fromJson(orderData, Order.class);
        if(orderBean.updateOrder(order) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    
    /*
    @GET
    public showOrder
    */
}

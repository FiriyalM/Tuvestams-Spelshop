/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.product;

import com.google.gson.Gson;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Elev
 */
@Path("product")
public class ProductResource {
    
    
    @EJB
    ProductBean productBean;
    
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createProduct(String productData){
        Gson gson = new Gson();
        Product product = gson.fromJson(productData, Product.class);
        if(productBean.addProduct(product) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
}

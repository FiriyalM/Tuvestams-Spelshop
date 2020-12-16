/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.product;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
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
 * @author Mohame Nader Alhamwi
 */
@Path("product")
public class ProductResource {
    
    @EJB
    ProductBean productBean;
    
    /**
     * med den här metoden söker man efter producten med hjälp av consoleType
     * den tar emot införmationen på detta viset {"consoleType":"PC"}
     * */
    @GET
    @Path("search/consoleType")
    public Response searchConsoleType(@HeaderParam("ConsoleType")String consoleType){
        Gson gson = new Gson();
        Product product = gson.fromJson(consoleType, Product.class);
        
        List<Product> newProduct = productBean.searchProductByConsoleType(product);
        
        if(newProduct == null){
            return Response.status(Response.Status.NO_CONTENT).build();
        }else if(newProduct.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }else{
           return Response.ok(newProduct).header("Access-Control-Allow-Origin","*").build();
        }
    }
    
    /**
     * med den här metoden söker man efter producten med hjälp av productName
     * den tar emot införmationen på detta viset {"productName":"Minecraft"}
     * */
    @GET
    @Path("search/productName")
    public Response searchProduct(@HeaderParam("productName")String productName){
        if(productName.charAt(0) == '{'){
            
            Gson gson = new Gson();
            Product product = gson.fromJson(productName, Product.class);
            
            List<Product> newProduct = productBean.searchProductByProductName(product);

            if(newProduct == null){
                return Response.status(Response.Status.NO_CONTENT).build();
            }else if(newProduct.isEmpty()){
                return Response.status(Response.Status.BAD_REQUEST).build();
            }else{
               return Response.ok(newProduct).header("Access-Control-Allow-Origin","*").build();
            }
        }else{
           String[] productId = productName.split(",");
           List<Product> product = new ArrayList<Product>();
            for (int i = 0; i < productId.length; i++) {
                System.out.println(productId[i]);
                product.add(productBean.showProduct(Integer.parseInt(productId[i])));
            }
            
           return Response.ok(product).build();
        }    
    }
    
    /**
     * den här metoden skapar en ny product
     * den tar emot införmationen på detta viset 
     *      {"productName":"Minecraft",
     *      "consoleType":"PC",
     *      "info":"Minecraft is a sandbox video game developed by Mojang",
     *      "imagePath":"img",
     *      "price":"199",
     *      "amountInStock":5}
     * */
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
    
    /**
     * med den här metoden tar bort en product
     * den tar emot införmationen på detta viset 
     *      {"productId":"3"}
     * */
    @DELETE
    public Response deleteProduct(@HeaderParam("productId") String productId){
        
        Gson gson = new Gson();
        Product product = gson.fromJson(productId, Product.class);
        
        if(productBean.deleteProduct(product) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    } 
    
    /**
     * med den här metoden ändrar på en product information 
     * den tar emot införmationen på detta viset 
     *      {"productName":"Minecraft",
     *      "consoleType":"PC",
     *      "info":"Minecraft is a sandbox video game developed by Mojang",
     *      "imagePath":"img",
     *      "price":"199",
     *      "amountInStock":5,
     *      "productId":"3"}
     * */
    @PUT
    @Consumes(MediaType.TEXT_PLAIN)
    public Response updateProduct(String productData){
        
        Gson gson = new Gson();
        Product product = gson.fromJson(productData, Product.class);
        
        if(productBean.updateProduct(product) == 1){
           return Response.ok().header("Access-Control-Allow-Origin","*").build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
}

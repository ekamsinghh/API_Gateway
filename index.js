const express= require('express');
const morgan = require('morgan');
const axios = require('axios');
const PORT=3004;
const { createProxyMiddleware } = require('http-proxy-middleware');
const app=express();
const rateLimit= require('express-rate-limit');//* manages no. of requests coming from an IP address

const limiter= rateLimit({
    windowMs: 2*60*1000,// 2 minutes
    max: 5
});
//* this means i will allow max of 5 requests coming from an ip address every 2 minutes

app.use(morgan('combined'));//* helps in logging
app.use(limiter);

app.use('/bookingservice',async(req,res,next)=>{
    // console.log(req.headers['x-access-token']);
    let success;
    try{
        const response= await axios.get('http://localhost:3001/api/v1/isAuthenticated',{
            headers:{
                'x-access-token': req.headers['x-access-token']
            }
        });
        success=response.data.success;
        console.log(response.data);
    }
    catch(error){
        return res.status(401).json({
            message: "Invalid or expired Token"
        });
    }
    if(success){
        next();
    }
    else{
        res.status(401).send({message:'Unauthorized User'});
    }
})

app.use('/bookingservice',createProxyMiddleware({
    target: 'http://localhost:3002/',
    changeOrigin: true
}));

app.get('/home',(req,res)=>{
    return res.json({
        message: 'Welcome to home page'
    });
});

app.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}`);
})
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhQGIuY29tIiwiaWF0IjoxNzQ4NDY0NDAzLCJleHAiOjE3NDg0NjgwMDN9.IbvBnFdqI1YnkXtqLsKG3S24SxIjnDWj_Oxtm9e_rsM"
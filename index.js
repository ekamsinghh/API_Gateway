const express= require('express');
const morgan = require('morgan')
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

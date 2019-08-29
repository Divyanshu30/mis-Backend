const verifyToken =(req, res, next)=>
{

    try
    {const bearerHeader = req.headers['authorization'];
    //console.log(req.headers);
    if(typeof bearerHeader !== 'undefined')
    {
    let bearer=bearerHeader.split(" ");
    //console.log(bearer);
    let bearerToken=bearer[1];
    req.token=bearerToken;
    next();
    }
    else
    {
        console.log("no token");
        req.token="";
      next();
    }
}
catch(err){
    console.log("something wrong with jwt");
    next();
}
}
module.exports=verifyToken;
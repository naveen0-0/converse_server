const jwt = require('jsonwebtoken')

const checkToken = (req,res,next) => {
  const logintoken = req.headers.authorization
  if(logintoken){
    jwt.verify(logintoken,process.env.ACCESS_TOKEN,(err,decoded) => {
        if(err)  return res.send({ operation:false, msg:"Error Decoding The Token" })
        req.user = decoded;
        next();
    })
  }else{
    return res.send({ operation:false, msg:"You have to be logged in to perform this action" })
  }
}

module.exports = {
  checkToken
}
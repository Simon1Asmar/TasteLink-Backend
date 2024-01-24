import jwt from "jsonwebtoken"
import User from "../models/users.schema.js"

export const isAuth = async (req, res, next) => {
  try {
    let token;

    // Get the headers Auth from client
    // either with A or a for authoentication to because some people send differently
    const authHeader = req.headers.Authorization || req.headers.authorization

    // Check if there is auth token
    if(authHeader){
      // Split the token to delete the "Bearer" keyword
      // this splits it and takes the first index ex ["Bearer", "???????(token)"]
      token = authHeader.split(" ")[1];

      // Verify the token with the secret
      jwt.verify(token, process.env.SECRET, async (err, decoded)=>{

        // Check if theres an error in decoding
        if(err){
          console.error(`ERROR DECODING ${token}`);
          return res.status(401).send("invalid token");
        }

        console.log("decoded", decoded)

        // Extract the id from payload body we sent to login func
        const {id} = decoded

        // Find the user using the id
        const user = await User.findById(id);

        // Check if there is a user
        if(!user){
          return res.status(404).send("User not found")
        }

        // append to the request object a new custom token were calling it user and add the user to is
        req.user = user;

        next();
      })
    }
    
  } catch (error) {
    next(error)
  }
}

export const isAdmin =  (req, res, next) => {
  try {

    const {role} = req.user

    if(role !== "admin"){
      res.status(403);
      throw new Error("Access Forbidden")
    }

    next();
  } catch (error) {
    next(error);
  }
}
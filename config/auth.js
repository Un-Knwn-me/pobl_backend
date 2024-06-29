const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");   
require('dotenv').config();

const hashPassword = async(password)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
}

const hashCompare = async(password, hash) =>{
  try {
    return await bcrypt.compare(password,hash);    
  } catch (error) {
    console.error('Error comparing hashes:', error);
    throw error;
  }
}

const createToken = ({ _id, email })=>{
  let token = jwt.sign({_id, email}, process.env.SecretKey, { expiresIn: '1h' });
//   var token = jwt.sign({email_id:'123@gmail.com'}, "Stack", {});
  return token;
}

const decodeToken = async(token) => {
  try {
    if(token) {
      let data = jwt.verify(token, process.env.SecretKey);
      return data;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {hashCompare, hashPassword, createToken, decodeToken,}
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECERET,{expiresIn:"3h"})
}

module.exports = generateToken
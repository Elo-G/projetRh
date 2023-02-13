let bcrypt = require('bcrypt');

let saltRounds = 5

let cryptPassword = async function(passwords){
    let salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(passwords ,salt)
}

let comparePassword = async function(plainPass, hashword){
let compare = bcrypt.compare(plainPass, hashword);
return compare;
}



module.exports = {
    cryptPassword,
    comparePassword
}
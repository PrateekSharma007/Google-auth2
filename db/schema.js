const mongoose = require("mongoose") ; 

const UserSchema = new mongoose.Schema({
    email :  {
        type : String, 
    }

})


module.exports = mongoose.model("user",UserSchema) ; 

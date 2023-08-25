const mongoose = require("mongoose") 
const db = mongoose.connect("mongodb+srv://prateek:prateek@cluster0.mew6qso.mongodb.net/?retryWrites=true&w=majority")
// console.log("Hello")




module.exports = db ; 

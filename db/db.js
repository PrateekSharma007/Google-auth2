const mongoose = require("mongoose") 
const db = mongoose.connect("mongodb+srv://sharmaprateek00000:prateek@cluster0.erxhvap.mongodb.net/?retryWrites=true&w=majority")



module.exports = db ; 

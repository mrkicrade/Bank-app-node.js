let mongoose = require('mongoose');

let accountSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    deposit : {
        type : String,
        required : true
    },
    card : {
        type : String,
        required : true
    }
});

let Account = module.exports = mongoose.model('Account', accountSchema);
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let UserSchema = Schema({
    id: Number,
    nom_complet: String,
    email: String,
    password: String,
    poste : String,
    image : String
});

UserSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut users) sera au pluriel, 
// soit users
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('users', UserSchema);

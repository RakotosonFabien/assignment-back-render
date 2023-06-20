let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentCompletSchema = Schema({
    _id : String,
    id: Number,
    nom: String,
    dateAttribution : Date,
    remarque : String,
    note : Number,
    dateDeRendu: Date,
    rendu: Boolean,
    etudiant : {
        id : Number,
        nom_complet : String,
        email : String,
        poste : String
    },
    matiere : {
        id : Number,
        nom : String
    },
    professeur : {
        id : Number,
        nom_complet : String,
        email : String,
        poste : String
    }
});

AssignmentCompletSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut assignments) sera au pluriel, 
// soit assignments
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('AssignmentComplet', AssignmentCompletSchema, 'assignmentsComplet');

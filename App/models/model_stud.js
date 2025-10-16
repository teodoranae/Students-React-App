const { Int32 } = require('mongodb');
const mongoose=require('mongoose');
const stud_Schema = mongoose.Schema({
    Grupa:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'grupes',
        required: true
    }, 
    Nume:
    {
        type:String, 
        required:true
    },
    Prenume:
    {
        type:String,
        required:true
    },
    Data_inmatricularii:
    {
        type:Date,
        required:true
    },
    Situatia_semestrului_anterior:
    {
        type: mongoose.Schema.Types.Mixed,
        required:true 
    },
    Numar_matricol:
    {
        type: Number,
        required:true
    }
});
const Students = mongoose.model("Studenti", stud_Schema);
module.exports = Students;
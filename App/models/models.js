const mongoose=require('mongoose');
const grSchema = mongoose.Schema({
    Materii: {
        type: [String],  
        required: true
    },
    Nume_grupa: {
        type: Number,  
        required: true
    },
    Ore_pe_saptamana: {
        type: Number,  
        required: true
    },
    Specializare: {
        type: String,
        required: true
    }
});

const Groups = mongoose.model("Grupe", grSchema);
module.exports = Groups;

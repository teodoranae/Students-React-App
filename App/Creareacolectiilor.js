const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Groups = require('./models/models.js');
const Students = require('./models/model_stud.js');

// Connect to MongoDB
mongoose.connect('mongodb+srv://studentunibuc14:studentunibuc14@cluster0.hi8p693.mongodb.net/144TeodoraNae?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(() => {
    console.log('Conectat la MongoDB');
    
})
.catch(err => console.error('Nu se poate conecta:', err));


async function insertGrupeData() {
    const jsonData = JSON.parse(fs.readFileSync(path.join('./', 'creategrupe.json'), 'utf-8'));

    const existingGroup = await Groups.findOne();

    if (!existingGroup) {
        try {
            await Groups.insertMany(jsonData);
            console.log('Colectie creata');
        } catch (error) {
            if (error.code === 11000) {
                console.log('Colectia exista deja');
            } else {
                console.log('Eroare:', error);
            }
        }
    } else {
        console.log('Colectia exista deja');
    }
}

async function insertStudentData() {
    const jsonData = JSON.parse(fs.readFileSync(path.join('./', 'createstudenti.json'), 'utf-8'));

    const collectionExists = await Students.findOne();

    if (!collectionExists) {
        try {
            await Students.insertMany(jsonData);
            console.log('Colectie creata');
        } catch (error) {
            if (error.code === 11000) {
                console.log('Colectia exista deja');
            } else {
                console.log('Eroare:', error);
            }
        }
    } else {
        console.log('Colectia exista deja');
    }
}

module.exports = {
    insertGrupeData,
    insertStudentData
};

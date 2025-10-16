var Express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Creareacolectiilor=require('./Creareacolectiilor.js');
const Groups = require("./models/models.js");
const Student= require("./models/model_stud.js");
const { ObjectId } = require('mongodb');

var app = Express();
app.use(cors());
app.use(bodyParser.json());

const db=mongoose.connection;

mongoose.connect('mongodb+srv:', {
    useNewUrlParser: true,
    useUnifiedTopology: true,                                   //conectarea la baza de date
    
}).then(() => {
        console.log('Conectat la MONGODB');
        
        Creareacolectiilor.insertGrupeData();                    //creearea colectiilor, pornind de la fisierele din folderul models
        Creareacolectiilor.insertStudentData();                  //si fisierele json

        app.listen(5050, () => {                                //conectarea la portul pentru backend
            console.log('Port 5050');
        });
    })
    .catch((error) => {
        console.log('Eroare:', error);
    });

app.get('/grupe', async (req, res)=>
{
    try{
        const grupe= await Groups.find({});
        res.status(200).json({grupe});
    }
    catch(error)
    {
        res.status(500).json({message: error.message});
    }
});
app.get("/studenti/:grupaId", async (req, res) => {
    try {
        const groupId = req.params.grupaId;

        const studenti = await Student.find({ Grupa: new ObjectId(groupId) });

        if (!studenti || studenti.length === 0) {
            return res.status(404).json({ message: "Grupa cu acest Id nu are studenti" });
        }

        res.status(200).json(studenti);
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: error.message });
    }
});

app.get("/situatiesem/:studentId", async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await Student.findOne({ _id: new ObjectId(studentId) });

        if (!student) {
            return res.status(404).json({ message: "Niciun student cu acest Id" });
        }

        const { Situatia_semestrului_anterior } = student;

        res.status(200).json(Situatia_semestrului_anterior || {});
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: error.message });
    }
});

app.post("/addStudent", async (req, res) => {
    try {
        const { Nume, Prenume, Numar_matricol,grupaId } = req.body;

        const newStudent =new Student ({
            Nume: Nume,
            Prenume: Prenume,
            Data_inmatricularii: new Date(),
            Situatia_semestrului_anterior: [],
            Numar_matricol: Numar_matricol,
            Grupa: new ObjectId(grupaId) 
        });

        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Eroare", error: error.message });
    }
});

app.patch("/editStud/:id", async (req, res) => {
    try {
        const studentId = req.params.id; 
        const {  Nume, Prenume, Numar_matricol } = req.body;
        
        const query = { _id: new ObjectId(studentId) };

        const updates = {
            $set: {
                Nume,
                Prenume,
                Numar_matricol
            }
        };

        const actualizare = await Student.findOneAndUpdate(query, updates, { new: true });

        if (!actualizare) {
            return res.status(404).json({ message: "Studentul nu poate fi gasit" });
        }

        res.status(200).json(actualizare);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete("/deleteStud/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        const studentSters = await Student.findOneAndDelete({ _id: new ObjectId(studentId) });

        if (!studentSters) {
            return res.status(404).json({ message: "Studentul nu exista in baza de date, deci nu poate fi sters" });
        }

        res.status(200).json( studentSters );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

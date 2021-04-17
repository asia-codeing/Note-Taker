const express = require('express');
const path = require('path');
const fs = require("fs");
//Imported 'uuid' npm package for the unique id
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html'))); 

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json'))); 


app.get('/api/notes:id', (req, res) => {
    
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    res.json(savedNotes);
    
});
//catch all requests
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.post('/api/notes', (req,res) => {
    
    const newNote = req.body
    newNote.id = uuidv4(); 
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json','utf8'));

    savedNotes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
    res.json(savedNotes);
});
app.delete('/api/notes/:id', (req,res) => {

    const idNote = req.params.id;
    console.log(idNote);

    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    // filter data to get notes except the one to delete
    const dataFilter = savedNotes.filter( note => note.id !== idNote);

     // Write new data to 'db.json' file
     fs.writeFileSync('./db/db.json', JSON.stringify(dataFilter));
        
     console.log(`Deleted note with id : ${idNote}`);

     // Send response
     res.json(dataFilter);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

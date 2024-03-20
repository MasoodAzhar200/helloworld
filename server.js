/********************************************************************************
* WEB322 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: __Muhammad Masood Azhar____________________ Student ID: _149328221_____________ Date: ___2024-03-20___________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const legoData = require("./modules/legoSets");
const { getAllThemes, addSet, editSet, getSetByNum, deleteSet} = require('./modules/legoSets'); // adjust the path as necessary

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  res.render("home", { active: 'home' });
});


app.get("/about", (req, res) => {
  res.render("about", { active: 'about' });
});


app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoData.getAllSets();
    res.render("sets", { sets: sets, active: 'collection' });
  } catch (error) {
    res.status(404).render("404");
  }
});


app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    const set = await legoData.getSetByNum(setNum); 
    if (set) {
      
      res.render("setDetail", { set: set, active: 'set' }); 
    } else {
      res.status(404).render("404", { active: '404' }); 
    }
  } catch (error) {
    res.status(500).render("500", { active: '500' }); 
  }
});


app.get('/lego/addSet', async (req, res) => {
  const themes = await getAllThemes(); 
  res.render('addSet', { themes: themes });
});


app.post('/lego/addSet', async (req, res) => {
  try {
    await addSet(req.body); 
    res.redirect('/lego/sets');
  } catch (err) {
    res.render('500', { message: `An error occurred: ${err.message}` });
  }
});


app.get('/lego/editSet/:num', async (req, res) => {
  try {
    const set = await getSetByNum(req.params.num);
    const themes = await getAllThemes();
    if (set) {
      res.render('editSet', { set: set, themes: themes });
    } else {
      res.status(404).send('Set not found');
    }
  } catch (error) {
    res.status(500).render('500', { message: error.message });
  }
});


app.post('/lego/editSet', async (req, res) => {
  try {
    await editSet(req.body.set_num, req.body);
    res.redirect('/lego/sets');
  } catch (error) {
    res.status(500).render('500', { message: error.message });
  }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
  try {
    await deleteSet(req.params.num);
    res.redirect('/lego/sets');
  } catch (error) {
    res.status(500).render('500', { message: `Sorry, encountered the following error: ${error.message}` });
  }
});


app.use((req, res) => {
  res.status(404).render("404", { message: "The specific set or theme you're looking for cannot be found." });
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

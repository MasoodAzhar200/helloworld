/********************************************************************************
* WEB322 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: __Muhammad Masood Azhar____________________ Student ID: _149328221_____________ Date: ___2024-03-03___________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const legoData = require("./modules/legoSets");

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.set('view engine', 'ejs');

// Serve the home page
app.get("/", (req, res) => {
  res.render("home", { active: 'home' });
});

// Serve the about page
app.get("/about", (req, res) => {
  res.render("about", { active: 'about' });
});

// Serve the lego sets, filter by theme if query parameter is present
app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoData.getAllSets();
    res.render("sets", { sets: sets, active: 'collection' });
  } catch (error) {
    res.status(404).render("404");
  }
});

// Serve a specific lego set by set number
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



// Custom 404 page
app.use((req, res) => {
  res.status(404).render("404", { message: "The specific set or theme you're looking for cannot be found." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

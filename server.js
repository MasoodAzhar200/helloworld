/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: __Muhammad Masood Azhar____________________ Student ID: _149328221_____________ Date: ___2024-02-11___________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const legoData = require("./modules/legoSets");

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Serve the about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Serve the lego sets, filter by theme if query parameter is present
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;
    const sets = theme ? await legoData.getSetsByTheme(theme) : await legoData.getAllSets();
    res.json(sets);
  } catch (error) {
    res.status(404).send("Sets not found for the specified theme");
  }
});

// Serve a specific lego set by set number
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setByNum = await legoData.getSetByNum(req.params.set_num);
    res.json(setByNum);
  } catch (error) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  }
});

// Remove the theme-demo route as it's no longer needed
// ...

// Custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

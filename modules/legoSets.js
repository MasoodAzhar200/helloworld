const setData = require("../data/setData");
const themeData = require("../data/themeData");


let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
      try {
        sets = setData.map(row => {
          const [setNum, setInfo] = Object.entries(row)[0];
          const [set_num,name, year, themeId, numParts, imgUrl] = setInfo.split(",");
          const themeObject = themeData.find(themeObj => themeObj.id === themeId);
          return {
            set_num,
            name,
            year,
            theme_id: themeId,
            num_parts: numParts,
            img_url: imgUrl,
            theme: themeObject ? themeObject.name : "Unknown Theme"
          };
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getAllSets() {
    return new Promise((resolve, reject) => {
      try {
        if (sets.length > 0) {
          resolve(sets);
        } else {
          reject("No sets available. Please run initialize() first.");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      try {
        const foundSet = sets.find(set => set.set_num === setNum);
        if (foundSet) {
          resolve(foundSet);
        } else {
          reject("Unable to find requested set.");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      try {
        const lowercaseTheme = theme.toLowerCase();
        const foundSets = sets.filter(set =>
          set.theme.toLowerCase().includes(lowercaseTheme)
        );
        if (foundSets.length > 0) {
          resolve(foundSets);
        } else {
          reject("Unable to find requested sets.");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme
};

const legoSets = require("../modules/legoSets");

legoSets.initialize()
  .then(() => legoSets.getAllSets())
  .then(allSets => {
    console.log("All Sets:", allSets);
    return legoSets.getSetByNum("0011-2");
  })
  .then(setByNum => {
    console.log("Set by Num:", setByNum);
    return legoSets.getSetsByTheme("tech");
  })
  .then(setsByTheme => {
    console.log("Sets by Theme (tech):", setsByTheme);
  })
  .catch(error => {
    console.error("Error:", error);
  });


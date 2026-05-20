const fs = require('fs');
const path = require('path');

// Chemin vers recipes.json
const recipesPath = path.join(__dirname, '..', 'recipes.json');

// Lire les recettes depuis recipes.json
const readRecipes = (callback) => {
  fs.readFile(recipesPath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    const parsed = JSON.parse(data);
    callback(null, parsed.recipes);
  });
};

// Écrire les recettes dans recipes.json
const writeRecipes = (recipes, callback) => {
  const data = JSON.stringify({ recipes }, null, 2);
  fs.writeFile(recipesPath, data, 'utf8', (err) => {
    callback(err);
  });
};

// Exporter les deux fonctions
module.exports = { readRecipes, writeRecipes };
const { readRecipes, writeRecipes } = require('./utils/fileHelper');

// Lire les arguments de la ligne de commande
const args = process.argv.slice(2);
const command = args[0];

// Commande LIST
if (command === 'list') {
  readRecipes((err, recipes) => {
    if (err) {
      console.log('Erreur :', err);
      return;
    }
    console.log('=== Toutes les recettes ===');
    recipes.forEach(recipe => {
      console.log(`- ${recipe.name} (${recipe.cuisine}) - ${recipe.prepTime} min`);
    });
  });

// Commande ADD
} else if (command === 'add') {
  const name = args[1];
  const cuisine = args[2];
  const prepTime = parseInt(args[3]);

  if (!name || !cuisine || !prepTime) {
    console.log('Usage: node cli.js add "Nom" "Cuisine" tempsPrep');
    return;
  }

  readRecipes((err, recipes) => {
    if (err) {
      console.log('Erreur :', err);
      return;
    }
    const newRecipe = {
      id: recipes.length + 1,
      name,
      cuisine,
      prepTime,
      ingredients: []
    };
    recipes.push(newRecipe);
    writeRecipes(recipes, (err) => {
      if (err) {
        console.log('Erreur :', err);
        return;
      }
      console.log(`Recette "${name}" ajoutée avec succès !`);
    });
  });

// Commande SEARCH
} else if (command === 'search') {
  const keyword = args[1];

  if (!keyword) {
    console.log('Usage: node cli.js search "mot-clé"');
    return;
  }

  readRecipes((err, recipes) => {
    if (err) {
      console.log('Erreur :', err);
      return;
    }
    const results = recipes.filter(r =>
      r.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (results.length === 0) {
      console.log('Aucune recette trouvée pour :', keyword);
    } else {
      console.log(`=== Résultats pour "${keyword}" ===`);
      results.forEach(r => {
        console.log(`- ${r.name} (${r.cuisine}) - ${r.prepTime} min`);
      });
    }
  });

// Commande inconnue
} else {
  console.log('=== Aide ===');
  console.log('node cli.js list                        → afficher toutes les recettes');
  console.log('node cli.js add "Nom" "Cuisine" temps   → ajouter une recette');
  console.log('node cli.js search "mot-clé"            → rechercher une recette');
}
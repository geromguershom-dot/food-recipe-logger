require('dotenv').config();
const http = require('http');
const url = require('url');
const { readRecipes } = require('./utils/fileHelper');

const PORT = process.env.PORT || 3000;

// Démonstration Event Loop — non-bloquant
// fs.readFile est asynchrone — ce console.log s'affiche AVANT
// la lecture du fichier car Node.js n'attend pas !
readRecipes((err, recipes) => {
  console.log('Fichier lu !', recipes.length, 'recettes trouvées');
});
console.log('Ce message s affiche AVANT la lecture du fichier !');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Headers JSON pour toutes les réponses
  res.setHeader('Content-Type', 'application/json');

  // Route GET /
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Bienvenue sur Food Recipe Logger API !',
      routes: ['GET /', 'GET /recipes', 'GET /recipes?cuisine=Cameroonian']
    }));

  // Route GET /recipes
  } else if (pathname === '/recipes' && req.method === 'GET') {
    readRecipes((err, recipes) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur lecture fichier' }));
        return;
      }

      // Filtrer par cuisine si query param présent
      if (query.cuisine) {
        const filtered = recipes.filter(r =>
          r.cuisine.toLowerCase() === query.cuisine.toLowerCase()
        );
        res.writeHead(200);
        res.end(JSON.stringify({ recipes: filtered }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify({ recipes }));
      }
    });

  // Route 404
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route non trouvée' }));
  }
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
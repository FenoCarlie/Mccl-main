const jwt = ('jsonwebtoken'); // Assurez-vous d'avoir cette dépendance installée

function generateToken(userData) {
  // Logique de génération de token ici
  const token = jwt.sign(userData, 'votre_clé_secrète', { expiresIn: '1h' });
  return token;
}

module.exports = { generateToken };
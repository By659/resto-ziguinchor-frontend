const API_URL = import.meta.env.VITE_API_URL;

// Petit client fetch qui attache automatiquement le token JWT stocké,
// et centralise la gestion des erreurs de l'API.
async function requete(chemin, options = {}) {
  const token = localStorage.getItem('token');

  const reponse = await fetch(`${API_URL}${chemin}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(data.message || 'Erreur API');
  return data;
}

export const api = {
  login: (telephone, motDePasse) => requete('/auth/login', { method: 'POST', body: { telephone, motDePasse } }),
  register: (payload) => requete('/auth/register', { method: 'POST', body: payload }),
  listerRestaurants: () => requete('/restaurants'),
  obtenirRestaurant: (id) => requete(`/restaurants/${id}`),
  creerCommande: (payload) => requete('/commandes', { method: 'POST', body: payload }),
  obtenirCommande: (id) => requete(`/commandes/${id}`),
  mesPoints: () => requete('/fidelite/moi'),
  commandesRestaurant: (restaurantId) => requete(`/commandes/restaurant/${restaurantId}`),
  changerStatutCommande: (id, statut) => requete(`/commandes/${id}/statut`, { method: 'PATCH', body: { statut } }),
  dashboard: (restaurantId) => requete(`/restaurants/${restaurantId}/dashboard`),
  creerCategorie: (payload) => requete('/restaurants/categories', { method: 'POST', body: payload }),
  creerPlat: (payload) => requete('/plats', { method: 'POST', body: payload }),
  modifierPlat: (id, payload) => requete(`/plats/${id}`, { method: 'PATCH', body: payload }),
  supprimerPlat: (id) => requete(`/plats/${id}`, { method: 'DELETE' }),
  basculerDisponibilitePlat: (id) => requete(`/plats/${id}/disponibilite`, { method: 'PATCH' }),
};

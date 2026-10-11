import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/BottomNav';

const DEGRADES = ['from-orange-400 to-orange-600', 'from-amber-400 to-orange-500', 'from-red-400 to-orange-500'];

export default function Menu() {
  const [restaurant, setRestaurant] = useState(null);
  const [categorieActive, setCategorieActive] = useState(null);
  const [chargement, setChargement] = useState(true);
  const { utilisateur } = useAuth();
  const { ajouter, lignes } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function charger() {
      const restaurants = await api.listerRestaurants();
      if (restaurants[0]) {
        const detail = await api.obtenirRestaurant(restaurants[0].id);
        setRestaurant(detail);
        setCategorieActive(detail.categories[0]?.id ?? null);
      }
      setChargement(false);
    }
    charger();
  }, []);

  if (chargement) return <p className="text-center mt-10">Chargement du menu...</p>;
  if (!restaurant) return <p className="text-center mt-10">Aucun restaurant disponible.</p>;

  const categorie = restaurant.categories.find((c) => c.id === categorieActive) || restaurant.categories[0];

  return (
    <div className="min-h-screen bg-orange-50/40 pb-28">
      {/* En-tête clair façon maquette : salutation, menu burger, panier */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <button className="bg-white rounded-xl w-10 h-10 flex items-center justify-center shadow-sm">☰</button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Bonjour, {utilisateur?.nom?.split(' ')[0] || 'cher client'} 👋</p>
            <h1 className="text-lg font-extrabold text-stone-800">{restaurant.nom.toUpperCase()}</h1>
          </div>
          <button
            onClick={() => navigate('/panier')}
            className="relative bg-white rounded-xl w-10 h-10 flex items-center justify-center shadow-sm"
          >
            🛒
            {lignes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {lignes.length}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 bg-white rounded-full shadow-sm px-4 py-3 text-sm text-gray-400">
          Rechercher un plat...
        </div>
      </div>

      {/* Bannière promo */}
      <div className="mx-4 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white p-5 relative overflow-hidden">
        <p className="bg-orange-500 inline-block text-[10px] px-2 py-0.5 rounded-full mb-2">EN CE MOMENT</p>
        <h2 className="text-xl font-bold leading-tight">{restaurant.nom}</h2>
        <p className="text-sm text-white/70 mt-1 max-w-[80%]">{restaurant.adresse}</p>
      </div>

      {/* Catégories en pastilles */}
      <div className="flex gap-3 overflow-x-auto px-4 mt-5 pb-1">
        {restaurant.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategorieActive(cat.id)}
            className={`flex flex-col items-center gap-1 shrink-0 ${
              categorieActive === cat.id ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${
                categorieActive === cat.id ? 'bg-orange-200' : 'bg-white'
              }`}
            >
              🍽️
            </div>
            <span className={`text-xs ${categorieActive === cat.id ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
              {cat.nom}
            </span>
          </button>
        ))}
      </div>

      {/* Grille de plats, façon "King Deals" */}
      <div className="px-4 mt-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-stone-800">{categorie?.nom}</h2>
          <span className="text-orange-500 text-sm">Voir tout →</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categorie?.plats.map((plat, i) => (
            <div key={plat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {plat.photoUrl ? (
                <img src={plat.photoUrl} alt={plat.nom} className="w-full h-auto block" />
              ) : (
                <div className={`h-20 bg-gradient-to-br ${DEGRADES[i % DEGRADES.length]}`} />
              )}
              <div className="p-3">
                <p className="font-medium text-sm truncate">{plat.nom}</p>
                <p className="text-xs text-gray-400 truncate">{plat.description || ' '}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-bold text-sm">{plat.prix} F</p>
                  <button
                    disabled={!plat.disponible}
                    onClick={() => ajouter(plat)}
                    className="bg-orange-500 disabled:bg-gray-300 text-white rounded-full w-7 h-7 text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

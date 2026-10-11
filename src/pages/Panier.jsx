import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/BottomNav';

export default function Panier() {
  const { lignes, retirer, total, vider } = useCart();
  const [type, setType] = useState('SUR_PLACE');
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  async function commander() {
    setEnvoi(true);
    setErreur(null);
    try {
      const restaurants = await api.listerRestaurants();
      const commande = await api.creerCommande({
        restaurantId: restaurants[0].id,
        type,
        lignes: lignes.map((l) => ({ platId: l.platId, quantite: l.quantite, prixUnitaire: l.prixUnitaire })),
      });
      vider();
      navigate(`/commandes/${commande.id}`);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/40 pb-28 p-4">
      <h1 className="text-xl font-extrabold text-stone-900 mb-4">Ton panier</h1>

      {lignes.length === 0 && <p className="text-gray-400">Panier vide.</p>}

      <div className="flex flex-col gap-2">
        {lignes.map((l) => (
          <div key={l.platId} className="flex justify-between items-center bg-white rounded-2xl shadow p-3">
            <div>
              <p className="font-semibold text-stone-900 text-sm">{l.nom}</p>
              <p className="text-xs text-gray-400">
                {l.quantite} × {l.prixUnitaire} F
              </p>
            </div>
            <button onClick={() => retirer(l.platId)} className="text-red-500 text-xs font-medium">
              Retirer
            </button>
          </div>
        ))}
      </div>

      {lignes.length > 0 && (
        <>
          <div className="mt-6">
            <p className="font-semibold text-stone-900 mb-2 text-sm">Mode de commande</p>
            <div className="flex gap-2">
              {['SUR_PLACE', 'EMPORTER', 'LIVRAISON'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    type === t ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-500'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 bg-white rounded-2xl shadow p-4">
            <span className="font-medium text-gray-500">Total</span>
            <span className="text-lg font-extrabold text-stone-900">{total} F</span>
          </div>

          {erreur && <p className="text-red-500 text-sm mt-2">{erreur}</p>}

          <button
            onClick={commander}
            disabled={envoi}
            className="w-full bg-orange-600 text-white font-semibold rounded-full py-3 mt-4 shadow"
          >
            {envoi ? 'Envoi...' : 'Commander'}
          </button>
        </>
      )}

      <BottomNav />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../api/client';
import BottomNav from '../components/BottomNav';

const ETAPES = ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'];

const LIBELLES = {
  EN_ATTENTE: 'En attente de confirmation',
  CONFIRMEE: 'Commande confirmée',
  EN_PREPARATION: 'En préparation',
  PRETE: 'Prête',
  EN_LIVRAISON: 'En livraison',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

export default function SuiviCommande() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    let socket;

    async function init() {
      // On attend d'avoir la commande (donc son restaurantId) AVANT de connecter le WebSocket :
      // sinon "rejoindre_resto" partait avec un id vide (bug de closure React) et aucune mise à
      // jour en temps réel n'arrivait (il fallait recharger la page pour voir le nouveau statut).
      const donnees = await api.obtenirCommande(id);
      setCommande(donnees);

      socket = io(import.meta.env.VITE_SOCKET_URL);
      socket.on('connect', () => socket.emit('rejoindre_resto', donnees.restaurantId));
      socket.on('statut_commande', (maj) => {
        if (maj.id === id) setCommande((prev) => ({ ...prev, ...maj }));
      });
    }
    init();

    return () => socket?.disconnect();
  }, [id]);

  if (!commande) return <p className="text-center mt-10">Chargement...</p>;

  const etapeActuelle = ETAPES.indexOf(commande.statut);

  return (
    <div className="min-h-screen bg-orange-50/40 pb-28 p-4">
      <h1 className="text-xl font-extrabold text-stone-900 mb-1">Commande {commande.numero}</h1>
      <p className="text-gray-400 mb-6">{commande.montantTotal} FCFA</p>

      <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        {ETAPES.filter((e) => e !== 'ANNULEE').map((etape, i) => (
          <div key={etape} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${i <= etapeActuelle ? 'bg-orange-600' : 'bg-gray-200'}`}
            />
            <span className={i <= etapeActuelle ? 'text-stone-900 font-semibold' : 'text-gray-400'}>
              {LIBELLES[etape]}
            </span>
          </div>
        ))}
      </div>

      {commande.statut === 'ANNULEE' && <p className="text-red-500 mt-4">Commande annulée.</p>}

      <BottomNav />
    </div>
  );
}

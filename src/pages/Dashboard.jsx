import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

function CarteStat({ titre, valeur, sous }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex-1 min-w-[140px]">
      <p className="text-sm text-gray-400">{titre}</p>
      <p className="text-2xl font-bold text-stone-900 mt-1">{valeur}</p>
      {sous && <p className="text-xs text-gray-400 mt-1">{sous}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { utilisateur } = useAuth();
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function charger() {
      try {
        const restaurants = await api.listerRestaurants();
        const id = restaurants[0]?.id;
        if (!id) return;
        const d = await api.dashboard(id);
        setDonnees(d);
      } catch (err) {
        setErreur(err.message);
      }
    }
    charger();
  }, []);

  if (utilisateur && !['RESPONSABLE_RESTO', 'ADMIN'].includes(utilisateur.role)) {
    return <p className="text-center mt-10 text-red-500">Accès réservé au responsable du restaurant.</p>;
  }

  if (erreur) return <p className="text-center mt-10 text-red-500">{erreur}</p>;
  if (!donnees) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-stone-100 p-4">
      <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
      <p className="text-gray-400 mb-6">Aujourd'hui</p>

      <div className="flex flex-wrap gap-3">
        <CarteStat titre="Chiffre d'affaires du jour" valeur={`${donnees.caDuJour} FCFA`} sous="Commandes livrées uniquement" />
        <CarteStat titre="Commandes du jour" valeur={donnees.totalCommandes} />
        <CarteStat titre="Taux d'annulation" valeur={`${donnees.tauxAnnulation.toFixed(1)}%`} />
        <CarteStat
          titre="Heure de pointe"
          valeur={donnees.heureDePointe !== null ? `${donnees.heureDePointe}h - ${donnees.heureDePointe + 1}h` : '—'}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mt-4">
        <h2 className="font-semibold mb-3">Plats les plus commandés aujourd'hui</h2>
        {donnees.platsPlusCommandes.length === 0 && (
          <p className="text-sm text-gray-400">Aucune commande aujourd'hui.</p>
        )}
        <div className="flex flex-col gap-2">
          {donnees.platsPlusCommandes.map((p, i) => (
            <div key={p.nom} className="flex justify-between items-center text-sm">
              <span>
                {i + 1}. {p.nom}
              </span>
              <span className="font-semibold text-orange-600">{p.quantite}×</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

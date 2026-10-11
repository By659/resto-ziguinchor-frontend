import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const { connexion } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      // Inscription toujours en CLIENT depuis ce formulaire public ; les autres rôles
      // (responsable resto, cuisinier, livreur, admin) sont créés autrement (pas de self-service).
      await api.register({ nom, telephone, email: email || undefined, motDePasse, role: 'CLIENT' });
      await connexion(telephone, motDePasse);
      navigate('/menu');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/40 flex items-center justify-center p-4">
      <div className="max-w-sm w-full p-6 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold mb-1">Créer un compte</h1>
        <p className="text-sm text-gray-400 mb-4">Commande en quelques secondes.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email (optionnel)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="border rounded-lg px-3 py-2"
            minLength={6}
            required
          />
          {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
          <button
            type="submit"
            disabled={envoi}
            className="bg-orange-500 text-white rounded-lg py-2 font-medium disabled:opacity-50"
          >
            {envoi ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-orange-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

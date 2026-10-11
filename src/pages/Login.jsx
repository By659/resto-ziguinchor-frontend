import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const { connexion } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    try {
      await connexion(telephone, motDePasse);
      navigate('/menu');
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/40 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow p-6">
        <p className="text-3xl mb-1">🍽️</p>
        <h1 className="text-xl font-extrabold text-stone-900 mb-1">Bon retour !</h1>
        <p className="text-sm text-gray-400 mb-5">Connecte-toi pour commander</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="tel"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm"
            required
          />
          {erreur && <p className="text-red-500 text-xs">{erreur}</p>}
          <button type="submit" className="bg-orange-600 text-white rounded-full py-3 font-semibold mt-2">
            Se connecter
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-orange-600 font-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

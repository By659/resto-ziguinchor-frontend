import { NavLink } from 'react-router-dom';

const icones = {
  accueil: (actif) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={actif ? '#ea580c' : '#9ca3af'} strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  profil: (actif) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={actif ? '#ea580c' : '#9ca3af'} strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
};

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t flex items-center justify-around py-2 z-20">
      <NavLink to="/menu" className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            {icones.accueil(isActive)}
            <span className={isActive ? 'text-orange-600 font-medium' : 'text-gray-400'}>Accueil</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/panier"
        className="bg-orange-500 rounded-full w-14 h-14 flex items-center justify-center -mt-6 shadow-lg"
      >
        <span className="text-white text-3xl leading-none">+</span>
      </NavLink>

      <NavLink to="/profil" className="flex flex-col items-center gap-1 text-[11px]">
        {({ isActive }) => (
          <>
            {icones.profil(isActive)}
            <span className={isActive ? 'text-orange-600 font-medium' : 'text-gray-400'}>Profil</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}

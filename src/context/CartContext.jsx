import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lignes, setLignes] = useState([]); // [{ platId, nom, prixUnitaire, quantite }]

  function ajouter(plat) {
    setLignes((prev) => {
      const existante = prev.find((l) => l.platId === plat.id);
      if (existante) {
        return prev.map((l) => (l.platId === plat.id ? { ...l, quantite: l.quantite + 1 } : l));
      }
      return [...prev, { platId: plat.id, nom: plat.nom, prixUnitaire: plat.prix, quantite: 1 }];
    });
  }

  function retirer(platId) {
    setLignes((prev) => prev.filter((l) => l.platId !== platId));
  }

  function vider() {
    setLignes([]);
  }

  const total = lignes.reduce((acc, l) => acc + l.prixUnitaire * l.quantite, 0);

  return (
    <CartContext.Provider value={{ lignes, ajouter, retirer, vider, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

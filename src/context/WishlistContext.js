import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const toggle = (id) => setItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const isWishlisted = (id) => items.includes(id);
  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

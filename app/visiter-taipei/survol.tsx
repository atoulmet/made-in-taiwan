'use client';

import { createContext, useContext } from 'react';

/**
 * Le quartier survolé dans la colonne de gauche, pour que la carte l'éclaire.
 *
 * Il passe par un contexte et non par une propriété : les fiches sont
 * fabriquées dans la page, qui est un composant serveur, et un composant
 * serveur ne peut pas transmettre de fonction de rappel à un composant client.
 */
export const Survol = createContext<{
  survole: string | null;
  setSurvole: (nom: string | null) => void;
}>({ survole: null, setSurvole: () => {} });

export function useSurvol() {
  return useContext(Survol);
}

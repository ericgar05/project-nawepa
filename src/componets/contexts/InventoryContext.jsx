import { createContext, useContext } from "react";

export const InventoryContext = createContext();

export const useInventory = () => {
  return useContext(InventoryContext);
};

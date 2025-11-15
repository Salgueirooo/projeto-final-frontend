import { useState, useEffect } from "react";
import type { bakeryDTO } from "../dto/bakeryDTO";


export const useSelectedBakery = () => {
  const [bakery, setBakery] = useState<bakeryDTO | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedBakery");
    if (saved) setBakery(JSON.parse(saved));
  }, []);

  return bakery;
};
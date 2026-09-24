// src/i18n/ui/zh/index.ts - le dictionnaire chinois complet, recompose depuis ses tranches.
//
// C'est LA source de verite des cles : la forme de cet objet definit le type
// `Dictionary` (voir ../types.ts), et toute autre langue doit l'honorer
// exactement. Une traduction a trous ne compile pas, ce qui est voulu.

import { zhChrome } from "./chrome";
import { zhPages } from "./pages";
import { zhReading } from "./reading";

export const zh = {
  ...zhChrome,
  ...zhPages,
  ...zhReading,
} as const;

export default zh;

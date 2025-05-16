import { Block } from "@/types/form";
import { block1 } from "./block1";
import { block2 } from "./block2";
import { block3 } from "./block3";
import { block4 } from "./block4";
import { block5 } from "./block5";
import { block6 } from "./block6";
import { block7 } from "./block7";
import { block8 } from "./block8";
import { block9 } from "./block9";
import { block10 } from "./block10";
import { block22 } from "./block22";
import { block23 } from "./block23";
import { block24 } from "./block24";
import { block25 } from "./block25";
import { block26 } from "./block26";
import { block27 } from "./block27";
import { blockStop } from "./blockStop";
import { block11 } from "./block11";
import { block11 as block12 } from "./block12";
import { block13 } from "./block13";
import { block6_repeating as block14 } from "./block14";
import { block9 as block28 } from "./block28";
import { block6_repeating as block29 } from "./block29";

// Esportare tutti i blocchi individualmente
export {
  block1,
  block2,
  block3,
  block4,
  block5,
  block6,
  block7,
  block8,
  block9,
  block10,
  block11,
  block12,
  block13,
  block14,
  block22,
  block23,
  block24,
  block25,
  block26,
  block27,
  block28,
  block29,
  blockStop
};

// Esportare l'array completo di tutti i blocchi, ordinato per priorità
export const allBlocks: Block[] = [
  block1,
  block2,
  block3,
  block4,
  block5,
  block6,
  block7,
  block8,
  block9,
  block10,
  block11,
  block12,
  block13,
  block14,
  block22,
  block23,
  block24,
  block25,
  block26,
  block27,
  block28,
  block29,
  blockStop
].sort((a, b) => a.priority - b.priority); // Ordina i blocchi per priorità

import { crafts } from "@shared/crafts";
import { z } from "zod";

export const craftSchema = z.object({
  craft: z.enum(crafts).optional(),
});

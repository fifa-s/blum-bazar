import { db } from "./index";
import { systemSetting } from "./schemas/index";

await db.insert(systemSetting).values([
  { name: "version", value: "0.1.0" },
  { name: "isMaintenance", value: "false" },
]);

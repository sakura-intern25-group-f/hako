import path from "path";
import fs from "fs";

export function readAsset(filename: string) {
  return fs.readFileSync(
    path.join(import.meta.dirname, "../../assets", filename),
    "utf8"
  );
}

import path from "path";
import { fileURLToPath } from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDirectory = path.resolve(currentDirectory, "../uploads");

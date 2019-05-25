import Datauri from "datauri";
import { join } from "path";

const cache = new Map<string, Datauri>();

export function resetMediaCache() {
  cache.clear();
}
export function loadFileAsDataURL(file: string) {
  const fullPath = join(process.cwd(), file);
  if (cache.has(fullPath)) {
    return cache.get(fullPath).content;
  }
  const datauri = new Datauri(fullPath);
  cache.set(fullPath, datauri);
  return datauri.content;
}

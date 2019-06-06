import Datauri from "datauri";
import { join } from "path";
import { EventEmitter } from "events";

export const mediaEvents = new EventEmitter();

const cache = new Map<string, Datauri>();

export function resetMediaCache() {
  cache.clear();
  mediaEvents.emit("reset");
}

export function useFileAsDataURL(file: string) {
  const fullPath = join(process.cwd(), file);
  if (cache.has(fullPath)) {
    return cache.get(fullPath).content;
  }
  const datauri = new Datauri(fullPath);
  cache.set(fullPath, datauri);

  mediaEvents.emit("load", fullPath);
  return datauri.content;
}

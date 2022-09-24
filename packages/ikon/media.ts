import Datauri from "datauri/parser";
import { EventEmitter } from "events";
import { readFileSync } from "fs";
import { extname, join } from "path";

export const mediaEvents = new EventEmitter();

const cache = new Map<string, Datauri>();

export function resetMediaCache() {
  cache.clear();
  mediaEvents.emit("reset");
}

export function useFileAsDataURL(file: string) {
  const fullPath = join(process.cwd(), file);
  if (cache.has(fullPath)) {
    return cache.get(fullPath)?.content!;
  }
  const contents = readFileSync(file);

  const datauri = new Datauri();
  datauri.format(extname(file), contents);

  cache.set(fullPath, datauri);

  mediaEvents.emit("load", fullPath);
  return datauri.content;
}

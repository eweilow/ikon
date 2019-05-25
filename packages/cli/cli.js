#!/usr/bin/env node

"use strict";

require("source-map-support").install();
delete process.env.SHOULD_USE_TSNODE;

process.env.EXCITARE_MAIN_ENTRY = __filename;

let resolved = null;
try {
  resolved = require.resolve("./dist/cjs/entry");
} catch (err) {}
if (resolved == null) {
  try {
    resolved = require.resolve("@eweilow/ikon/dist/cjs/entry");
  } catch (err) {}
}
if (resolved == null) {
  throw new Error("Could not find @eweilow/ikon");
}
require(resolved);

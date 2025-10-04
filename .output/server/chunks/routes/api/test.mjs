import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { q as query } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'mssql';

const test = defineEventHandler(async () => {
  try {
    const result = await query("SELECT GETDATE() AS currentTime");
    return result;
  } catch (err) {
    console.error("SQL \u932F\u8AA4\u8A0A\u606F\uFF1A", err.message);
    return {
      error: true,
      message: err.message,
      detail: err
    };
  }
});

export { test as default };
//# sourceMappingURL=test.mjs.map

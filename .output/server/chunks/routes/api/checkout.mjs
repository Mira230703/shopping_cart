import { d as defineEventHandler, r as readBody } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const checkout = defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("\u6536\u5230\u8A02\u55AE\uFF1A", body);
  return { message: "\u2705 \u8A02\u55AE\u5DF2\u9001\u51FA\uFF01" };
});

export { checkout as default };
//# sourceMappingURL=checkout.mjs.map

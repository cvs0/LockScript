"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visitDeep = exports.mapDeep = exports.isZod = exports.isRecord = exports.findFirstDeep = exports.ZodShape = void 0;
var _zod = require("zod");
const isZod = Type => input => {
  try {
    Type.parse(input);
    return true;
  } catch {
    return false;
  }
};
exports.isZod = isZod;
const ZodShape = shape => _zod.z.object(shape).strict();
exports.ZodShape = ZodShape;
const isRecord = input => !Array.isArray(input) && typeof input === `object` && input !== null;
exports.isRecord = isRecord;
const mapDeep = (current, replace) => {
  if (Array.isArray(current)) {
    for (let k = 0; k < current.length; k++) {
      current[k] = replace(mapDeep(current[k], replace));
    }
  } else if (isRecord(current)) {
    for (const k of Object.keys(current)) {
      current[k] = replace(mapDeep(current[k], replace));
    }
  }
  return current;
};
exports.mapDeep = mapDeep;
const findFirstDeep = (current, predicate, path = []) => {
  if (predicate(current, path)) {
    return [true, current, path];
  }
  if (Array.isArray(current)) {
    for (let k = 0; k < current.length; k++) {
      path.push(`${k}`);
      const [found, value] = findFirstDeep(current[k], predicate, path);
      if (found) {
        return [found, value, path];
      }
      path.pop();
    }
    return [false, null, []];
  }
  if (isRecord(current)) {
    for (const k of Object.keys(current)) {
      path.push(k);
      const [found, value] = findFirstDeep(current[k], predicate, path);
      if (found) {
        return [found, value, path];
      }
      path.pop();
    }
    return [false, null, []];
  }
  return [false, null, []];
};
exports.findFirstDeep = findFirstDeep;
const visitDeep = (current, visit, path = []) => {
  visit(current, path);
  if (Array.isArray(current)) {
    for (let k = 0; k < current.length; k++) {
      path.push(`${k}`);
      visitDeep(current[k], visit, path);
      path.pop();
    }
    return;
  }
  if (isRecord(current)) {
    for (const k of Object.keys(current)) {
      path.push(k);
      visitDeep(current[k], visit, path);
      path.pop();
    }
    return;
  }
  return;
};
exports.visitDeep = visitDeep;
//# sourceMappingURL=util.js.map
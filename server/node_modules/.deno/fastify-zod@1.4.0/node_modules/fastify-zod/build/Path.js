"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyPath = exports.setAtPath = exports.replacePathPrefix = exports.matchPathPrefix = exports.getChildPath = exports.getAtPathSafe = exports.getAtPath = exports.equalPath = exports.deleteAtPath = void 0;
var _util = require("./util");
const stringifyPath = path => path.join(`/`);
exports.stringifyPath = stringifyPath;
const equalPath = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let k = 0; k < a.length; k++) {
    if (a[k] !== b[k]) {
      return false;
    }
  }
  return true;
};
exports.equalPath = equalPath;
const getParentPath = path => {
  if (path.length === 0) {
    throw new Error(`path='${stringifyPath(path)}' has no parent`);
  }
  return path.slice(0, -1);
};
const getChildPath = (path, ...childPath) => [...path, ...childPath];
exports.getChildPath = getChildPath;
const getPathLastSegment = path => {
  if (path.length === 0) {
    throw new Error(`path='${stringifyPath}' has no parent`);
  }
  return path[path.length - 1];
};
const getChildSafe = (current, segment) => {
  if (Array.isArray(current)) {
    const index = parseInt(segment);
    if (!Number.isInteger(index)) {
      throw new Error(`current is an array but segment='${segment}' is not an integer`);
    }
    if (index < 0) {
      throw new Error(`current is an array but index='${index}' is negative`);
    }
    return [typeof current[index] !== undefined, current[index]];
  }
  if ((0, _util.isRecord)(current)) {
    return [Object.keys(current).includes(segment), current[segment]];
  }
  return [false, undefined];
};
const getAtPathSafe = (obj, path) => {
  let current = obj;
  for (let k = 0; k < path.length; k++) {
    const [childFound, child] = getChildSafe(current, path[k]);
    if (!childFound) {
      if (k !== path.length - 1) {
        throw new Error(`parent(path='${stringifyPath(path)}') has no child at segment='${path[k]}'`);
      }
      return [false, undefined];
    }
    current = child;
  }
  return [true, current];
};
exports.getAtPathSafe = getAtPathSafe;
const getAtPath = (obj, path) => {
  const [found, value] = getAtPathSafe(obj, path);
  if (!found) {
    throw new Error(`value(path='${stringifyPath(path)}') not found`);
  }
  return value;
};
exports.getAtPath = getAtPath;
const setAtPath = (obj, path, value) => {
  const [parentFound, parent] = getAtPathSafe(obj, getParentPath(path));
  if (!parentFound) {
    throw new Error(`parent(path='${stringifyPath(path)}') not found`);
  }
  const key = getPathLastSegment(path);
  if (Array.isArray(parent)) {
    const index = parseInt(key);
    if (!Number.isInteger(index)) {
      throw new Error(`key(path='${stringifyPath(path)}', key='${key}') is not an integer`);
    }
    if (index < 0) {
      throw new Error(`index(path='${stringifyPath(path)}', index='${index}') is negative`);
    }
    if (index > parent.length) {
      throw new Error(`index(path='${stringifyPath(path)}', index='${index}') is out of bounds`);
    }
    if (index === parent.length) {
      parent.push(value);
    } else {
      parent[index] = value;
    }
  } else if ((0, _util.isRecord)(parent)) {
    parent[key] = value;
  } else {
    throw new Error(`parent(path='${path}') is not an Array or a Record`);
  }
};
exports.setAtPath = setAtPath;
const deleteAtPath = (obj, path) => {
  const [parentFound, parent] = getAtPathSafe(obj, getParentPath(path));
  if (!parentFound) {
    throw new Error(`parent(path='${stringifyPath(path)}') not found`);
  }
  const key = getPathLastSegment(path);
  if (Array.isArray(parent)) {
    const index = parseInt(key);
    if (!Number.isInteger(index)) {
      throw new Error(`key(path='${stringifyPath(path)}', key='${key}') is not an integer`);
    }
    if (index !== parent.length) {
      throw new Error(`index(path='${stringifyPath(path)}', index='${index}') is invalid: only last item of parent array can be deleted`);
    }
    parent.pop();
  } else if ((0, _util.isRecord)(parent)) {
    if (!Object.keys(parent).includes(key)) {
      throw new Error(`key(path='${stringifyPath(path)}', key='${key}') not found in parent`);
    }
    delete parent[key];
  } else {
    throw new Error(`parent(path='${stringifyPath(path)}') is not an Array or a Record`);
  }
};
exports.deleteAtPath = deleteAtPath;
const matchPathPrefix = (prefixPath, path) => {
  if (path.length < prefixPath.length) {
    return false;
  }
  for (let k = 0; k < prefixPath.length; k++) {
    if (path[k] !== prefixPath[k]) {
      return false;
    }
  }
  return true;
};
exports.matchPathPrefix = matchPathPrefix;
const replacePathPrefix = (prevPrefixPath, nextPrefixPath, path) => {
  if (!matchPathPrefix(prevPrefixPath, path)) {
    throw new Error(`path='${stringifyPath(path)}' doesn't match prevPrefixPath='${stringifyPath(prevPrefixPath)}'`);
  }
  return [...nextPrefixPath, ...path.slice(prevPrefixPath.length)];
};
exports.replacePathPrefix = replacePathPrefix;
//# sourceMappingURL=Path.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpecTransformer = void 0;
var _util = require("util");
var _changeCase = require("change-case");
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _Path = require("./Path");
var _util2 = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isRef = ref => {
  if (!(0, _util2.isRecord)(ref)) {
    return false;
  }
  return typeof ref.$ref === `string`;
};
const toRefPath = $ref => {
  const indexOfPath = $ref.indexOf(`#`);
  return {
    basePath: $ref.slice(0, indexOfPath),
    path: $ref.slice(indexOfPath + 1).split(`/`).slice(1)
  };
};
const toRef = refPath => ({
  $ref: [`${refPath.basePath}#`, ...refPath.path].join(`/`)
});
const isSpecSchema = input => {
  if (!(0, _util2.isRecord)(input)) {
    return false;
  }
  const {
    properties,
    additionalProperties,
    patternProperties,
    items
  } = input;
  if (typeof properties !== `undefined` && !(0, _util2.isRecord)(properties)) {
    return false;
  }
  if (typeof additionalProperties !== `undefined` && typeof additionalProperties !== `boolean` && !(0, _util2.isRecord)(additionalProperties)) {
    return false;
  }
  if (typeof patternProperties !== `undefined` && typeof patternProperties !== `boolean` && !(0, _util2.isRecord)(patternProperties)) {
    return false;
  }
  if (typeof items !== `undefined` && !(0, _util2.isRecord)(items)) {
    return false;
  }
  return true;
};
const isSpecSchemas = input => {
  if (!(0, _util2.isRecord)(input)) {
    return false;
  }
  for (const value of Object.values(input)) {
    if (!isSpecSchema(value)) {
      return false;
    }
  }
  return true;
};
const isOpenApiSpec = input => {
  if (!(0, _util2.isRecord)(input)) {
    return false;
  }
  const {
    components,
    paths
  } = input;
  if (!(0, _util2.isRecord)(components)) {
    return false;
  }
  const {
    schemas
  } = components;
  if (!isSpecSchemas(schemas)) {
    return false;
  }
  if (typeof paths !== `undefined` && !(0, _util2.isRecord)(paths)) {
    return false;
  }
  return true;
};
const isSwaggerSpec = input => {
  if (!(0, _util2.isRecord)(input)) {
    return false;
  }
  const {
    definitions,
    paths
  } = input;
  if (!isSpecSchemas(definitions)) {
    return false;
  }
  if (typeof paths !== `undefined` && !(0, _util2.isRecord)(paths)) {
    return false;
  }
  return true;
};
const isSpec = input => isOpenApiSpec(input) || isSwaggerSpec(input);
const deepClone = spec => JSON.parse(JSON.stringify(spec));
const defaultExtractSchemaPropertiesKey = [`properties`, `additionalProperties`, `patternProperties`, `items`];
const withTimings = fn => {
  const begin = performance.now();
  const result = fn();
  const end = performance.now();
  return [result, {
    begin,
    end,
    delta: end - begin
  }];
};
class SpecTransformer {
  constructor(spec, DEBUG = false) {
    if (!isSpec(spec)) {
      throw new Error(`spec is not an OpenApiSpec or a SwaggerSpec`);
    }
    this.spec = deepClone(spec);
    this.schemasPath = isOpenApiSpec(spec) ? [`components`, `schemas`] : [`definitions`];
    this.initialSchemaKeys = this.getSchemaKeys();
    this.DEBUG = DEBUG;
  }
  _DEBUG = (...args) => {
    if (this.DEBUG) {
      console.debug(...args);
    }
  };
  throw = error => {
    if (this.DEBUG) {
      console.debug((0, _util.inspect)(this.spec, {
        depth: null
      }));
      console.error(error);
    }
    throw error;
  };
  getSchemaPath = schemaKey => (0, _Path.getChildPath)((0, _Path.getChildPath)(this.schemasPath, schemaKey));
  getSchema = schemaKey => {
    const schema = this.getAtPath(this.getSchemaPath(schemaKey));
    if (!isSpecSchema(schema)) {
      return this.throw(new Error(`schema is not a SpecSchema`));
    }
    return schema;
  };
  getSchemaKeys = () => {
    const schemas = this.getAtPath(this.schemasPath);
    if (!(0, _util2.isRecord)(schemas)) {
      return this.throw(new Error(`schemas is not a Record`));
    }
    return Object.keys(schemas);
  };
  createSchemaKey = (parentSchemaKey, path, schemaKeysOptions) => {
    const parts = [];
    if (!schemaKeysOptions?.removeInitialSchemasPrefix || !this.initialSchemaKeys.includes(parentSchemaKey)) {
      parts.push(parentSchemaKey);
    }
    parts.push(...path);
    const baseName = parts.join(`_`);
    const schemaKey = schemaKeysOptions?.changeCase === `PascalCase` ? (0, _changeCase.pascalCase)(baseName) : schemaKeysOptions?.changeCase === `camelCase` ? (0, _changeCase.camelCase)(baseName) : schemaKeysOptions?.changeCase === `param-case` ? (0, _changeCase.paramCase)(baseName) : schemaKeysOptions?.changeCase === `snake_case` ? (0, _changeCase.snakeCase)(baseName) : baseName;
    if (this.getSchemaKeys().includes(schemaKey)) {
      throw new Error(`schemaKey(schemaKey='${schemaKey}') already exists`);
    }
    return schemaKey;
  };
  getAtPath = path => (0, _Path.getAtPath)(this.spec, path);
  getAtPathSafe = path => (0, _Path.getAtPathSafe)(this.spec, path);
  resolveRef = $ref => {
    const refPath = toRefPath($ref);
    if (refPath.basePath.length > 0) {
      const nextRef = toRef({
        basePath: ``,
        path: (0, _Path.getChildPath)(this.getSchemaPath(refPath.basePath), ...refPath.path)
      });
      return this.resolveRef(nextRef.$ref);
    }
    const value = this.getAtPath(refPath.path);
    if (isRef(value)) {
      return this.resolveRef(value.$ref);
    }
    return [value, $ref];
  };
  setAtPath = (path, value) => {
    this._DEBUG(`setAtPath`, {
      path,
      value
    });
    return (0, _Path.setAtPath)(this.spec, path, value);
  };
  deleteAtPath = path => {
    this._DEBUG(`deleteAtPath`, {
      path
    });
    return (0, _Path.deleteAtPath)(this.spec, path);
  };
  findFirstDeep = predicate => (0, _util2.findFirstDeep)(this.spec, predicate);
  hasProperRef = schemaKey => {
    const schemaPath = this.getSchemaPath(schemaKey);
    const [hasProperRef] = this.findFirstDeep((value, path) => {
      if ((0, _Path.equalPath)(path, schemaPath)) {
        return false;
      }
      if (isRef(value)) {
        const refPath = toRefPath(value.$ref);
        return refPath.basePath.length === 0 && (0, _Path.matchPathPrefix)(schemaPath, refPath.path);
      }
      return false;
    });
    return hasProperRef;
  };
  deleteUnusedSchemas = () => {
    this._DEBUG(`deleteUnusedSchemas`);
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (const schemaKey of this.getSchemaKeys()) {
        if (!this.hasProperRef(schemaKey)) {
          this.deleteAtPath(this.getSchemaPath(schemaKey));
          dirty = true;
          break;
        }
      }
    }
  };
  rewriteSchemaAbsoluteRefs = schemaKey => {
    const schema = this.getSchema(schemaKey);
    const schemaPath = this.getSchemaPath(schemaKey);
    let dirty = false;
    (0, _util2.visitDeep)(schema, value => {
      if (isRef(value)) {
        const refPath = toRefPath(value.$ref);
        if (refPath.basePath.length === 0 && !(0, _Path.matchPathPrefix)(schemaPath, refPath.path)) {
          const nextPath = (0, _Path.getChildPath)(schemaPath, ...refPath.path);
          value.$ref = toRef({
            basePath: ``,
            path: nextPath
          }).$ref;
          dirty = true;
        }
      }
    });
    return dirty;
  };
  rewriteSchemasAbsoluteRefs = () => {
    this._DEBUG(`rewriteSchemasAbsoluteRefs`);
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (const schemaKey of this.getSchemaKeys()) {
        if (this.rewriteSchemaAbsoluteRefs(schemaKey)) {
          dirty = true;
          break;
        }
      }
    }
  };
  extractSchemaPathAsSchema = (prevSchemaKey, prevRelativePath, nextSchemaKey) => {
    const prevPath = (0, _Path.getChildPath)(this.getSchemaPath(prevSchemaKey), ...prevRelativePath);
    const prevValue = this.getAtPath(prevPath);
    const nextPath = this.getSchemaPath(nextSchemaKey);
    const [hasValueAtNextPath, valueAtNextPath] = this.getAtPathSafe(nextPath);
    if (hasValueAtNextPath) {
      if (!(0, _fastDeepEqual.default)(prevValue, valueAtNextPath)) {
        this.throw(new Error(`schema(schemaKey='${nextSchemaKey}') already exists with a different value`));
      }
    } else {
      this.setAtPath(nextPath, prevValue);
    }
    this.setAtPath(prevPath, toRef({
      basePath: ``,
      path: nextPath
    }));
    let dirty = false;
    (0, _util2.visitDeep)(this.spec, value => {
      if (isRef(value)) {
        const refPath = toRefPath(value.$ref);
        if (refPath.basePath.length === 0 && (0, _Path.matchPathPrefix)(prevPath, refPath.path)) {
          value.$ref = toRef({
            basePath: ``,
            path: (0, _Path.replacePathPrefix)(prevPath, nextPath, refPath.path)
          }).$ref;
          dirty = true;
        }
      }
    });
    return dirty;
  };
  extractSchemaPropertiesAtKey = (parentSchemaKey, propertiesKey, schemaKeysOptions) => {
    let globalDirty = false;
    let dirty = true;
    while (dirty) {
      dirty = false;
      if (propertiesKey === `properties` || propertiesKey === `additionalProperties` || propertiesKey === `patternProperties`) {
        const properties = this.getSchema(parentSchemaKey)[propertiesKey];
        if ((0, _util2.isRecord)(properties)) {
          for (const k of Object.keys(properties)) {
            const property = properties[k];
            if (!isRef(property)) {
              const nextSchemaKey = this.createSchemaKey(parentSchemaKey, [`${k}`], schemaKeysOptions);
              this.extractSchemaPathAsSchema(parentSchemaKey, [propertiesKey, k], nextSchemaKey);
              dirty = true;
              break;
            }
          }
        }
      }
      if (propertiesKey === `items`) {
        const properties = this.getSchema(parentSchemaKey)[propertiesKey];
        if ((0, _util2.isRecord)(properties) && !isRef(properties)) {
          const nextSchemaKey = this.createSchemaKey(parentSchemaKey, [`item`], schemaKeysOptions);
          this.extractSchemaPathAsSchema(parentSchemaKey, [`items`], nextSchemaKey);
          dirty = true;
        }
      }
      if (dirty) {
        globalDirty = true;
      }
    }
    return globalDirty;
  };
  extractSchemaProperties = (schemaKey, propertiesKeys, schemaKeysOptions) => {
    let globalDirty = false;
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (const propertiesKey of propertiesKeys) {
        if (this.extractSchemaPropertiesAtKey(schemaKey, propertiesKey, schemaKeysOptions)) {
          dirty = true;
        }
      }
      if (dirty) {
        globalDirty = true;
      }
    }
    for (const propertiesKey of propertiesKeys) {
      if (this.extractSchemaPropertiesAtKey(schemaKey, propertiesKey, schemaKeysOptions)) {
        this.extractSchemaProperties(schemaKey, propertiesKeys, schemaKeysOptions);
        return true;
      }
    }
    return globalDirty;
  };
  extractSchemasProperties = (propertiesKeys, schemaKeysOptions) => {
    this._DEBUG(`extractSchemasProperties`);
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (const schemaKey of this.getSchemaKeys()) {
        if (this.extractSchemaProperties(schemaKey, propertiesKeys, schemaKeysOptions)) {
          dirty = true;
          break;
        }
      }
    }
  };
  mergeRef = prev$ref => {
    const [schema, next$ref] = this.resolveRef(prev$ref);
    let globalDirty = false;
    let dirty = true;
    while (dirty) {
      dirty = false;
      (0, _util2.visitDeep)(this.spec, (value, path) => {
        if (value !== schema && (0, _fastDeepEqual.default)(value, schema)) {
          this.setAtPath(path, {
            $ref: next$ref
          });
          dirty = true;
        }
      });
      if (dirty) {
        globalDirty = true;
      }
    }
    return globalDirty;
  };
  mergeRefs = $refs => {
    let dirty = true;
    while (dirty) {
      dirty = false;
      for (const $ref of $refs) {
        if (this.mergeRef($ref)) {
          dirty = true;
          break;
        }
      }
    }
  };
  transformWithTimings = (opts = {}) => {
    const [{
      rewriteSchemasAbsoluteRefs,
      extractSchemasProperties,
      mergeRefs,
      deleteUnusedSchemas
    }, total] = withTimings(() => {
      const [, rewriteSchemasAbsoluteRefs] = withTimings(() => {
        if (opts.rewriteSchemasAbsoluteRefs === false) {
          return;
        }
        this.rewriteSchemasAbsoluteRefs();
      });
      const [, mergeRefs] = withTimings(() => {
        if (opts.mergeRefs) {
          this.mergeRefs(opts.mergeRefs.map(ref => ref.$ref));
        }
      });
      this._DEBUG({
        mergeRefs
      });
      this._DEBUG({
        rewriteSchemasAbsoluteRefs
      });
      const [, extractSchemasProperties] = withTimings(() => {
        if (opts.extractSchemasProperties === false) {
          return;
        }
        const extractSchemasPropertiesKeys = !Array.isArray(opts.extractSchemasProperties) ? defaultExtractSchemaPropertiesKey : opts.extractSchemasProperties;
        this.extractSchemasProperties(extractSchemasPropertiesKeys, opts.schemaKeys);
      });
      this._DEBUG({
        extractSchemasProperties
      });
      const [, deleteUnusedSchemas] = withTimings(() => {
        if (opts.deleteUnusedSchemas === false) {
          return;
        }
        this.deleteUnusedSchemas();
      });
      this._DEBUG({
        deleteUnusedSchemas
      });
      return {
        rewriteSchemasAbsoluteRefs,
        extractSchemasProperties,
        mergeRefs,
        deleteUnusedSchemas
      };
    });
    this._DEBUG({
      total
    });
    return {
      spec: this.spec,
      timings: {
        rewriteSchemasAbsoluteRefs,
        extractSchemasProperties,
        mergeRefs,
        deleteUnusedSchemas,
        total
      }
    };
  };
  transform = (opts = {}) => this.transformWithTimings(opts).spec;
}
exports.SpecTransformer = SpecTransformer;
//# sourceMappingURL=SpecTransformer.js.map
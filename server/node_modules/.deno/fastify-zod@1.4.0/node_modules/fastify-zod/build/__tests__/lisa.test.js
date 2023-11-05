"use strict";

var _promises = require("fs/promises");
var _path = require("path");
var _SpecTransformer = require("../SpecTransformer");
test(`lisa`, async () => {
  const originalSpec = JSON.parse(await (0, _promises.readFile)((0, _path.join)(__dirname, `..`, `..`, `src`, `__tests__`, `lisa.openapi.original.fixtures.json`), {
    encoding: `utf-8`
  }));
  const t = new _SpecTransformer.SpecTransformer(originalSpec);
  const $ref = key => ({
    $ref: `T#/properties/${key}`
  });
  const result = t.transform({
    mergeRefs: [$ref(`JsonRecord`), $ref(`Uuid`), $ref(`Email`), $ref(`UserEmail`), $ref(`GroupRole`), $ref(`ParticipantRole`), $ref(`ParticipantId`), $ref(`ParticipantGroupId`), $ref(`UserParticipantRelationship`)],
    schemaKeys: {
      removeInitialSchemasPrefix: true,
      changeCase: `PascalCase`
    }
  });
  await (0, _promises.writeFile)((0, _path.join)(__dirname, `..`, `..`, `src`, `__tests__`, `lisa.openapi.transformed.fixtures.json`), JSON.stringify(result, null, 2), {
    encoding: `utf-8`
  });
  const transformedSpec = JSON.parse(await (0, _promises.readFile)((0, _path.join)(__dirname, `..`, `..`, `src`, `__tests__`, `lisa.openapi.transformed.fixtures.json`), {
    encoding: `utf-8`
  }));
  expect(result).toEqual(transformedSpec);
});
//# sourceMappingURL=lisa.test.js.map
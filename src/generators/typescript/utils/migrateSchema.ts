/**
 * Lightweight JSON Schema migration from draft-04/06/07 to 2020-12.
 *
 * Replaces the `alterschema` dependency which pulled in broken `@hyperjump/pact`
 * postinstall scripts causing Yarn build failures (see #2494).
 *
 * Covers the most common conversions needed for JsonBinPack schema compatibility:
 * - `$schema` URI update
 * - `definitions` → `$defs` + pointer rewrite
 * - `exclusiveMinimum`/`exclusiveMaximum` boolean → numeric form (draft-04)
 * - `items` tuple form → `prefixItems` (draft-04/06)
 * - Nested `$ref` pointer updates in sub-schemas
 */

const DRAFT_2020_12_SCHEMA = 'https://json-schema.org/draft/2020-12/schema';
const OBJECT_TYPE = 'object';

// Keys whose values are maps of named sub-schemas (e.g. `properties`).
const SCHEMA_MAP_KEYS = [
  'properties',
  'patternProperties',
  'additionalProperties',
  '$defs',
  'definitions'
];

// Keys whose values are a single sub-schema or an array of sub-schemas.
const SCHEMA_OR_LIST_KEYS = [
  'additionalItems',
  'prefixItems',
  'allOf',
  'anyOf',
  'oneOf',
  'not'
];

type SchemaObject = Record<string, unknown>;

function isSchemaObject(value: unknown): value is SchemaObject {
  return (
    typeof value === OBJECT_TYPE && value !== null && !Array.isArray(value)
  );
}

// definitions → $defs (draft-04/06)
function renameDefinitions(obj: SchemaObject): void {
  if (obj.definitions !== undefined && obj.$defs === undefined) {
    obj.$defs = obj.definitions;
    delete obj.definitions;
  }
}

// exclusiveMinimum/Maximum as boolean → numeric (draft-04 only)
function normalizeExclusiveBounds(obj: SchemaObject): void {
  if (obj.exclusiveMinimum === true && obj.minimum !== undefined) {
    obj.exclusiveMinimum = obj.minimum;
    delete obj.minimum;
  }
  if (obj.exclusiveMaximum === true && obj.maximum !== undefined) {
    obj.exclusiveMaximum = obj.maximum;
    delete obj.maximum;
  }
}

// items (tuple) → prefixItems (draft-04/06)
function tupleItemsToPrefixItems(obj: SchemaObject): void {
  if (Array.isArray(obj.items)) {
    obj.prefixItems = obj.items;
    delete obj.items;
  }
}

// Migrate the sub-schemas held under map-valued keys (e.g. `properties`).
function migrateSchemaMaps(obj: SchemaObject): void {
  for (const key of SCHEMA_MAP_KEYS) {
    // Keys come from a fixed constant list, so this access is safe.
    // eslint-disable-next-line security/detect-object-injection
    const value = obj[key];
    if (!isSchemaObject(value)) {
      continue;
    }
    for (const sub of Object.values(value)) {
      if (isSchemaObject(sub)) {
        migrateObject(sub);
      }
    }
  }
}

// Migrate the sub-schemas held under keys that are a single schema or a list.
function migrateSchemaLists(obj: SchemaObject): void {
  for (const key of SCHEMA_OR_LIST_KEYS) {
    // Keys come from a fixed constant list, so this access is safe.
    // eslint-disable-next-line security/detect-object-injection
    const value = obj[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isSchemaObject(item)) {
          migrateObject(item);
        }
      }
    } else if (isSchemaObject(value)) {
      migrateObject(value);
    }
  }
}

// Recursively migrate the sub-schemas nested under the given object.
function migrateChildren(obj: SchemaObject): void {
  migrateSchemaMaps(obj);

  // `items` when it is a single schema rather than a tuple.
  if (isSchemaObject(obj.items)) {
    migrateObject(obj.items);
  }

  migrateSchemaLists(obj);
}

function migrateObject(obj: SchemaObject): void {
  renameDefinitions(obj);
  normalizeExclusiveBounds(obj);
  tupleItemsToPrefixItems(obj);
  migrateChildren(obj);
}

/**
 * Rewrite JSON string representation of `$ref` pointers from
 * `#/definitions/...` to `#/$defs/...`.
 */
function rewriteRefPointers(json: string): string {
  return json.replace(/"#\/definitions\//g, '"#/$defs/');
}

/**
 * Migrate a JSON Schema from draft-04/06/07 to 2020-12.
 *
 * @param schema - The source JSON Schema object
 * @param fromVersion - The detected source draft (`draft4`, `draft6`, `draft7`)
 * @returns A new schema object migrated to 2020-12
 */
export function migrateSchemaTo202012(
  schema: SchemaObject,
  fromVersion: string
): SchemaObject {
  // Clone to avoid mutating the input
  const result = JSON.parse(JSON.stringify(schema)) as SchemaObject;
  const isLegacyDraft = fromVersion === 'draft4' || fromVersion === 'draft6';

  // Apply structural migrations for draft-04 and draft-06
  if (isLegacyDraft) {
    migrateObject(result);
  }

  // Always set $schema URI to 2020-12 (required by jsonbinpack)
  result.$schema = DRAFT_2020_12_SCHEMA;

  // Rewrite any remaining $ref pointers (covers nested refs in stringified sub-schemas)
  if (isLegacyDraft) {
    return JSON.parse(
      rewriteRefPointers(JSON.stringify(result))
    ) as SchemaObject;
  }

  return result;
}

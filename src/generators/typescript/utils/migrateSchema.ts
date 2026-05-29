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

const DRAFT4_SCHEMA = "http://json-schema.org/draft-04/schema#";
const DRAFT6_SCHEMA = "http://json-schema.org/draft-06/schema#";
const DRAFT202012_SCHEMA = "https://json-schema.org/draft/2020-12/schema";

function migrateObject(obj: Record<string, unknown>): void {
  // definitions → $defs (draft-04/06)
  if (obj["definitions"] !== undefined && obj["$defs"] === undefined) {
    obj["$defs"] = obj["definitions"];
    delete obj["definitions"];
  }

  // exclusiveMinimum as boolean → numeric (draft-04 only)
  if (obj["exclusiveMinimum"] === true && obj["minimum"] !== undefined) {
    obj["exclusiveMinimum"] = obj["minimum"];
    delete obj["minimum"];
  }

  // exclusiveMaximum as boolean → numeric (draft-04 only)
  if (obj["exclusiveMaximum"] === true && obj["maximum"] !== undefined) {
    obj["exclusiveMaximum"] = obj["maximum"];
    delete obj["maximum"];
  }

  // items (tuple) → prefixItems (draft-04/06)
  if (Array.isArray(obj["items"])) {
    obj["prefixItems"] = obj["items"];
    delete obj["items"];
  }

  // Recursively migrate sub-schemas in properties, patternProperties, items, etc.
  for (const key of ["properties", "patternProperties", "additionalProperties", "$defs", "definitions"]) {
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      for (const sub of Object.values(val as Record<string, unknown>)) {
        if (sub && typeof sub === "object") {
          migrateObject(sub as Record<string, unknown>);
        }
      }
    }
  }

  // Recursively migrate in items (when it's a schema, not tuple)
  if (obj["items"] && typeof obj["items"] === "object" && !Array.isArray(obj["items"])) {
    migrateObject(obj["items"] as Record<string, unknown>);
  }

  // Recursively migrate in additionalItems, prefixItems
  for (const key of ["additionalItems", "prefixItems", "allOf", "anyOf", "oneOf", "not"]) {
    const val = obj[key];
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === "object") {
          migrateObject(item as Record<string, unknown>);
        }
      }
    } else if (val && typeof val === "object") {
      migrateObject(val as Record<string, unknown>);
    }
  }
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
 * @param fromVersion - Source version: 'draft4', 'draft6', or 'draft7'
 * @returns A new schema object migrated to 2020-12
 */
export function migrateSchemaTo202012(schema: Record<string, unknown>, fromVersion: string): Record<string, unknown> {
  // Clone to avoid mutating the input
  const result = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;

  // Apply structural migrations for draft-04 and draft-06
  if (fromVersion === "draft4" || fromVersion === "draft6") {
    migrateObject(result);
  }

  // Always set $schema URI to 2020-12 (required by jsonbinpack)
  result["$schema"] = DRAFT202012_SCHEMA;

  // Rewrite any remaining $ref pointers (covers nested refs in stringified sub-schemas)
  if (fromVersion === "draft4" || fromVersion === "draft6") {
    const rewritten = JSON.stringify(result);
    const fixed = rewriteRefPointers(rewritten);
    return JSON.parse(fixed);
  }

  return result;
}

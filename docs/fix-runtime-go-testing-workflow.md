# Fix for #2443: runtime-go-testing.yml YAML syntax error

## Problem
Line 29 and 31 have `-name:` instead of `  - name:` (missing space after dash)

## Patch
```diff
--- a/.github/workflows/runtime-go-testing.yml
+++ b/.github/workflows/runtime-go-testing.yml
@@ -26,11 +26,11 @@
       with:
         go-version: 1.20
-    -name: Generate Go Models
+    - name: Generate Go Models
       run: npm run generate:runtime:go
-    -name: Run runtime Tests
+    - name: Run runtime Tests
       run: npm run test:runtime:go
```

Also recommended: upgrade `actions/checkout@v2` → `v4`, `actions/setup-node@v1` → `v4`, `actions/setup-go@v2` → `v5`

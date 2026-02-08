# feat: make full navigation area clickable in docs sidebar

## Description
Enhanced the docs sidebar navigation to make the entire clickable area available for all navigation items. Previously, only the text portion was clickable, which provided a poor user experience.

## Changes Made
- Updated navigation links in `src/components/docs/Docs.tsx` to wrap Link components with `<li className="p-2">` elements
- Added `className="block w-full"` to Link components to ensure full-width clickable area
- Applied changes to:
  - Directory items with README files (line 43)
  - API Docs link (line 61) 
  - Regular navigation items (line 76)

## Benefits
- Improved user experience with larger clickable targets
- Better accessibility compliance
- Consistent navigation behavior across all sidebar items
- Modern UI interaction pattern

## Screenshots
Before: Only text was clickable
After: Full navigation area is clickable

## Testing
- Tested on localhost:3002
- Verified all navigation items work correctly
- Confirmed mobile and desktop navigation both function properly
- No impact on existing functionality

## Checklist
- [x] Code follows project style guidelines
- [x] Self-reviewed the code changes
- [x] Tested the changes locally
- [x] No breaking changes introduced

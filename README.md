# Black Flag Resynced Companion — Version 4.0 Animus Engine Test

This package is the first Version 4 test build. It replaces the map interaction layer while preserving the existing database and local-storage format.

## Test checklist

1. Pinch in and out repeatedly.
2. Drag the map with one finger.
3. Release after a quick drag and confirm momentum stops at the map edges.
4. Zoom out and confirm nearby markers recombine.
5. Zoom in and confirm clusters split.
6. Tap every numbered cluster and choose a location.
7. Enable **Developer** in Filters to view live engine diagnostics.
8. Confirm progress, favorites, notes and backups still work.

## Upload

Upload every file in this folder to the repository root and allow GitHub to replace files with matching names.

After GitHub Pages deploys:

1. Open the site in Safari.
2. Refresh twice.
3. Close Safari completely.
4. Remove the previous Home Screen shortcut.
5. Add the site to the Home Screen again.

The new service worker uses a separate Version 4 cache.

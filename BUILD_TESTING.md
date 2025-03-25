# Testing Builds Locally

This document describes how to test your builds locally before deploying to production environments like Render.

## Why Test Builds Locally?

When deploying to production, build failures can be frustrating and time-consuming to debug. The most common issues are:

1. **Unresolved dependencies**: Missing packages or packages not properly marked as external
2. **Missing assets**: Images, fonts, or other static assets not found during build
3. **Environment configuration**: Differences between local and production environments

By testing your build locally, you can catch and fix these issues before pushing to production.

## Using the Build Test Script

We've created a script that simulates the production build process and provides helpful feedback on any issues found.

### Step 1: Run the test build script

```bash
./test-build.sh
```

### Step 2: Review results

If the script finds any issues, it will:
- Show which dependencies failed to resolve
- Provide instructions on how to fix them
- Save detailed logs in the `build-logs/` directory

### Common Issues and Solutions

#### Unresolved Dependencies

If you see an error like this:
```
[vite]: Rollup failed to resolve import "package-name" from "/path/to/file.tsx"
```

Fix it by:
1. Add the package to root `package.json` (not just client's package.json)
2. Add the package to the `external` array in `vite.config.ts`
3. Run the test script again to verify the fix

#### Missing Assets

If you see warnings about assets not being found:
```
/image.png referenced in /image.png didn't resolve at build time
```

Fix it by:
1. Ensure the asset exists in the `client/public/` directory
2. Verify the path is correct in your code
3. For dynamically loaded assets, consider using import statements instead of URL references

## Pre-Deployment Checklist

Before pushing to production, run through this checklist:

1. ✓ Run `./test-build.sh` and fix any issues
2. ✓ Check that all required environment variables are set
3. ✓ Verify that the start script in package.json points to the correct location
4. ✓ Test the build locally with `npm run build` followed by `npm start`

By following these steps, you'll save time and avoid failed deployments. 
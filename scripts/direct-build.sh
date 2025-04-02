#!/bin/bash

# Exit on error
set -e

echo "=== Starting direct build script ==="
echo "Current directory: $(pwd)"

# Ensure we're in the project root
if [ ! -d "./client" ]; then
  echo "ERROR: Client directory not found in current directory!"
  exit 1
fi

# Replace client package.json directly
echo "=== Fixing client/package.json ==="
cat > client/package.json <<'EOF'
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.3.0",
    "framer-motion": "11.13.1",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "puppeteer": "^24.4.0",
    "react": "18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.53.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "lovable-tagger": "^1.1.7",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  },
  "resolutions": {
    "esbuild": "0.21.5"
  },
  "overrides": {
    "esbuild": "0.21.5"
  }
}
EOF

# Create simplified vite.config.ts
echo "=== Creating simplified vite.config.ts ==="
cat > client/vite.config.ts <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
EOF

# Create a .npmrc file that forces correct versions
echo "=== Creating .npmrc with version resolution ==="
cat > client/.npmrc <<'EOF'
legacy-peer-deps=true
strict-peer-dependencies=false
auto-install-peers=false
save-exact=true
EOF

# Navigate to client directory
cd client
echo "=== In client directory: $(pwd) ==="

# Force clean install without previous node_modules
echo "=== Cleaning node_modules ==="
rm -rf node_modules

# Install dependencies with special flags
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps --no-audit --ignore-engines

# Fix esbuild nested dependency issues
echo "=== Fixing nested esbuild dependencies ==="
mkdir -p node_modules/.temp
cd node_modules/.temp
cat > package.json <<'EOF'
{
  "name": "esbuild-fixer",
  "version": "1.0.0",
  "dependencies": {
    "esbuild": "0.21.5"
  }
}
EOF

npm install
cp -r node_modules/esbuild/* ../esbuild/
cd ../..

# Check Vite's esbuild version
echo "=== Checking Vite's esbuild version ==="
if [ -d "node_modules/vite/node_modules/esbuild" ]; then
  cp -r node_modules/.temp/node_modules/esbuild/* node_modules/vite/node_modules/esbuild/
  echo "Fixed Vite's esbuild dependency"
fi

echo "=== Building client ==="
NODE_ENV=production npm run build

# Verify build output
if [ -d "./dist" ]; then
  echo "=== Build succeeded, dist directory contents: ==="
  ls -la ./dist
else
  echo "ERROR: Build failed, dist directory not created"
  exit 1
fi

echo "=== Direct build completed successfully ===" 
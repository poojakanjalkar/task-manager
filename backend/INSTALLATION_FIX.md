# Fix for Dependency Installation Error

## Problem
You're encountering a peer dependency conflict between:
- `@langchain/community@0.3.15` (requires `@langchain/core@0.3.x`)
- `@langchain/openai@1.2.1` (requires `@langchain/core@1.x`)

## Solution

Install dependencies using the `--legacy-peer-deps` flag:

```bash
cd backend
npm install --legacy-peer-deps
```

This flag tells npm to use the legacy (npm v4-v6) peer dependency resolution algorithm, which is more permissive and will allow the installation to proceed despite the peer dependency conflict.

## Why This Works

The `--legacy-peer-deps` flag is a standard and acceptable solution for peer dependency conflicts. It's commonly used when:
- Different packages require different major versions of the same peer dependency
- The packages are still compatible at runtime despite the version mismatch
- You want to avoid forking or modifying packages

## Alternative Solutions

If you prefer not to use `--legacy-peer-deps`, you can:

1. **Remove Tavily (Optional Feature)**: The travel agent works perfectly without Tavily search. You can remove `@langchain/community` from `package.json` if you don't need web search functionality.

2. **Use Compatible Versions**: Wait for updated versions of the packages that are fully compatible, or use older versions that work together.

## After Installation

Once installed, the travel agent will work normally. The Tavily search feature is optional - if `@langchain/community` isn't available, the agent will simply work without web search capabilities.

#!/bin/bash
# Build frontend from root
npm run build

# Ensure .next is accessible for Vercel
ls -la frontend/.next

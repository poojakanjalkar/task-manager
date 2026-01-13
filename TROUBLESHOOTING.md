# Troubleshooting Guide

## White Screen Issue

If you're seeing a white screen when clicking the search button, follow these steps:

### 1. Check Browser Console
Open your browser's developer console (F12 or Cmd+Option+I on Mac) and look for:
- Red error messages
- Network errors
- JavaScript errors

### 2. Check Backend Server
Make sure the backend server is running:
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5001
😺 Tom the Travel Agent is ready!
```

### 3. Check API Connection
Open browser console and check:
- Network tab: Look for requests to `http://localhost:5001/api/travel/chat`
- Console tab: Look for API call logs

### 4. Common Issues

#### Issue: "Failed to fetch" or "NetworkError"
**Solution**: Backend server is not running or not accessible
- Start the backend: `cd backend && npm run dev`
- Check if port 5001 is available
- Verify `VITE_API_URL` in frontend `.env` file

#### Issue: CORS Error
**Solution**: Check backend CORS configuration
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL (usually `http://localhost:5173`)

#### Issue: "Invalid response format"
**Solution**: Backend is returning unexpected data
- Check backend logs for errors
- Verify OpenAI API key is set correctly

#### Issue: OpenAI API Error
**Solution**: Check your OpenAI API key
- Verify `OPENAI_API_KEY` is set in backend `.env`
- Check if API key is valid and has credits

### 5. Debug Steps

1. **Test Backend Health**:
   ```bash
   curl http://localhost:5001/api/travel/health
   ```
   Should return: `{"success":true,"message":"Travel agent service is running"}`

2. **Test API Endpoint**:
   ```bash
   curl -X POST http://localhost:5001/api/travel/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Tell me about Delhi","city":"Delhi"}'
   ```

3. **Check Frontend Environment**:
   - Verify `.env` file exists in `Learn_AI/` directory
   - Should contain: `VITE_API_URL=http://localhost:5001/api`

4. **Check Browser Console Logs**:
   - Look for: "Calling API:", "Response status:", "Response data:"
   - These logs will show what's happening

### 6. Quick Fixes

**If white screen persists:**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Check if Error Boundary is showing (should show error message instead of white screen)
4. Restart both frontend and backend servers

**If still not working:**
- Check that all dependencies are installed: `npm install --legacy-peer-deps` in backend
- Verify Node.js version (should be v16 or higher)
- Check that OpenAI API key is valid

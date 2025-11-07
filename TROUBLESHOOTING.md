# BluSlide.AI Troubleshooting Guide

## Issue: "Failed to generate gallery" Error

If you're seeing an immediate error after clicking "Explore Ideas", here's how to diagnose it:

### Step 1: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to the Console tab
3. Look for error messages - they should now show specific details

### Step 2: Check Server Logs

If deployed on Vercel:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment → "Functions" tab
3. Find `/api/generate-gallery` logs
4. Look for console.log messages showing:
   - "Starting gallery generation for challenge..."
   - "AI Provider: anthropic" or "openai"
   - "Has Anthropic key: true/false"
   - "Has OpenAI key: true/false"

### Common Issues and Solutions

#### Issue 1: API Key Not Configured

**Error message:** "AI provider not configured. Please set ANTHROPIC_API_KEY environment variable."

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the appropriate API key:
   - For Anthropic: `ANTHROPIC_API_KEY=sk-ant-...`
   - For OpenAI: `OPENAI_API_KEY=sk-...`
3. Optional: Set `AI_PROVIDER=anthropic` or `AI_PROVIDER=openai`
4. Redeploy the application

#### Issue 2: Invalid API Key

**Error message:** "Anthropic API error: Invalid API key" or "OpenAI API error: Incorrect API key"

**Solution:**
1. Verify your API key is correct
2. For Anthropic: Get key from https://console.anthropic.com/
3. For OpenAI: Get key from https://platform.openai.com/api-keys
4. Update the environment variable in Vercel
5. Redeploy

#### Issue 3: API Rate Limit

**Error message:** "Anthropic API error: rate_limit_error" or "OpenAI API error: Rate limit reached"

**Solution:**
- Wait a few minutes and try again
- Check your API plan/billing
- Consider upgrading your API tier if needed

#### Issue 4: Network/Timeout Error

**Error message:** "Anthropic API error: network timeout" or similar

**Solution:**
- Check if Anthropic/OpenAI services are operational
- Retry the request
- If persistent, check Vercel function timeout settings (default 10s)

#### Issue 5: JSON Parsing Error

**Error message:** "No JSON found in AI response. The AI may have returned an error or unexpected format."

**Solution:**
- This usually indicates the AI returned an error message instead of the expected JSON
- Check server logs for the actual AI response (first 500 chars will be logged)
- The AI might be overwhelmed by the prompt size - this is rare but possible
- Contact support if persistent

### Environment Variables Reference

Required (choose one):
```bash
# For Anthropic Claude (default)
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# For OpenAI GPT-4
OPENAI_API_KEY=sk-xxx
```

Optional:
```bash
# Specify which provider to use (default: anthropic)
AI_PROVIDER=anthropic  # or "openai"

# Base URL (usually not needed)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Debugging in Development

If running locally (`npm run dev`):

1. Create `.env.local` file:
```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key-here
```

2. Start dev server:
```bash
npm run dev
```

3. Try generating a gallery
4. Check terminal output for detailed logs

### Getting More Help

1. **Check logs**: Always check both browser console AND server logs
2. **Error message**: The error alert now shows specific error details
3. **Network tab**: Check the `/api/generate-gallery` request in DevTools Network tab
4. **Status code**:
   - 400 = Bad request (missing challenge)
   - 500 = Server error (API key or AI generation issue)
5. **Response body**: Check the response for `error` and `details` fields

### Verification Checklist

Before reporting an issue, verify:
- [ ] Environment variable is set in Vercel
- [ ] API key is valid and active
- [ ] API key has sufficient credits/quota
- [ ] You've redeployed after adding environment variables
- [ ] Browser console shows specific error details
- [ ] Server logs show where the error occurred

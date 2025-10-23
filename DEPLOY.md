# Deploy BluSlide Accelerated Learning to Vercel

## Quick Deploy (Easiest Method)

### Option 1: Vercel Dashboard Upload
1. Go to https://vercel.com/new
2. Click "Browse" or drag and drop these files:
   - `index.html`
   - `vercel.json`
   - `package.json`
3. Click "Deploy"
4. Done! Your site will be live in seconds

### Option 2: Vercel CLI (If you have it installed)
```bash
# In the folder with these files, run:
vercel --prod
```

### Option 3: GitHub Integration (Best for ongoing updates)
1. Create a new GitHub repository
2. Upload these files to the repo
3. Go to https://vercel.com/new
4. Import your GitHub repository
5. Click "Deploy"
6. Future updates: Just push to GitHub and it auto-deploys!

## After Deployment

1. Open your deployed URL
2. Click the "⚙️ Settings" button
3. Get your OpenAI API key from https://platform.openai.com/api-keys
4. Paste it in the settings modal
5. Click "Save Settings"
6. Start chatting!

## Troubleshooting

**Can't find the files?**
- They should all be in the same folder as this DEPLOY.md file

**Settings modal won't save?**
- Make sure your browser allows localStorage
- Try a different browser if issues persist

**API errors?**
- Check that your OpenAI API key is valid
- Verify you have credits in your OpenAI account
- Make sure the key starts with "sk-"

## Files Included

- `index.html` - The main application
- `vercel.json` - Vercel configuration
- `package.json` - Project metadata
- `DEPLOY.md` - This file

## Need Help?

The chat interface will guide you through any API key issues. Just follow the prompts!

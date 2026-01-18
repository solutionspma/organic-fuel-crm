# Quick Fix Instructions

## The deploy is failing because Netlify has build settings configured that aren't needed.

### To fix:
1. Go to: https://app.netlify.com/sites/organicfuel/configuration/builds
2. Under "Build settings":
   - Clear "Build command" (should be empty)
   - Set "Publish directory" to: `public`
3. Under "Build plugins":
   - Remove "@netlify/plugin-nextjs" (not needed)
4. Click Save

Then I can redeploy successfully.

### OR Manual Deploy:
1. Go to: https://app.netlify.com/sites/organicfuel/deploys
2. Drag and drop: `/tmp/deploy.zip` 
3. Wait 30 seconds
4. Done!

Let me know which you prefer.

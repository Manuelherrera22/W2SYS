# Watch Management System - Deployment Instructions

## Automatic Netlify Deployment

Your Watch Management System is ready to be deployed to Netlify!

### Quick Deploy (Recommended)

Run the deployment script:

```powershell
.\deploy-netlify.ps1
```

This script will automatically:
1. Install all dependencies
2. Build the Next.js project
3. Deploy to Netlify using the provided API key
4. Provide you with the live URL

### Manual Deployment Option

If you prefer to deploy manually:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Netlify:**
   
   Option A - Using Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=out
   ```

   Option B - Using Netlify Dashboard:
   - Go to https://app.netlify.com
   - Drag and drop the `out` folder
   - Your site will be live!

### API Key Information

**Netlify API Key:** `nfp_CyJB1R8sLhTxLvxxZp6cKq8oBPFekqffb832`

This key is already configured in the deployment script.

## Project Features

✅ Modern dark theme UI
✅ Full CRUD operations for watch management
✅ Search and filter functionality
✅ Responsive design (mobile, tablet, desktop)
✅ TypeScript for type safety
✅ Tailwind CSS for styling
✅ Radix UI components
✅ Local storage persistence
✅ Professional watch collection management

## Tech Stack

- **Framework:** Next.js 14 (Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Animations:** Framer Motion

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Support

For any issues with deployment, check:
- Node.js is installed (v18 or higher recommended)
- npm is working correctly
- Netlify CLI is installed (`npm install -g netlify-cli`)

---

**Ready to deploy!** Run `.\deploy-netlify.ps1` to get your site live on Netlify.





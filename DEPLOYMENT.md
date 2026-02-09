# Deployment Guide - Vercel with GitHub Actions

This guide will help you deploy your portfolio to Vercel using GitHub Actions for automatic deployments on every push to `main`.

## 🚀 Quick Setup (5 Steps)

### Step 1: Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click "Add New" → "Project"
3. Import your `KevinDM15/portfolio` repository
4. **IMPORTANT**: Don't click "Deploy" yet! We need to get the tokens first.

### Step 2: Get Vercel Tokens

You need 3 secrets from Vercel:

#### A. Vercel Token
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it: `GitHub Actions Deploy`
4. Scope: `Full Account`
5. Copy the token (you'll only see it once!)

#### B. Vercel Org ID
```bash
# Run in your terminal (after installing Vercel CLI):
npx vercel login
npx vercel link
```
This will create `.vercel/project.json` with your IDs.

**Or get it from Vercel Dashboard:**
1. Go to your project settings
2. Look for "Project ID" and "Team ID" (or Org ID)

#### C. Vercel Project ID
Found in the same `.vercel/project.json` file or project settings.

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo: `https://github.com/KevinDM15/portfolio`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 3 secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VERCEL_TOKEN` | Token from Step 2A | `AbC123...` |
| `VERCEL_ORG_ID` | Your Vercel team/org ID | `team_abc123` |
| `VERCEL_PROJECT_ID` | Your project ID | `prj_xyz789` |

### Step 4: Push the Workflow File

```bash
# The workflow file is already created at:
# .github/workflows/deploy-vercel.yml

# Add and commit it:
git add .github/workflows/deploy-vercel.yml DEPLOYMENT.md
git commit -m "ci: add Vercel deployment workflow"
git push origin fix/typescript-errors-and-navbar

# Then merge to main (or push directly to main if you prefer)
```

### Step 5: Test the Deployment

1. Push any change to `main` branch
2. Go to **Actions** tab in your GitHub repo
3. You should see "Deploy to Vercel" workflow running
4. Once complete, your site will be live! 🎉

---

## 📋 How It Works

The workflow triggers on:
- ✅ Every push to `main` (production deploy)
- ✅ Every pull request to `main` (preview deploy)

**What it does:**
1. Checks out your code
2. Installs dependencies with pnpm
3. Builds your Astro project
4. Deploys to Vercel with production settings

---

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 🌐 Custom Domain Setup

After your first deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `kevindiaz.dev`)
4. Follow Vercel's DNS instructions
5. SSL certificate is automatic! ✅

---

## 🐛 Troubleshooting

### "Missing Vercel token"
- Make sure you added `VERCEL_TOKEN` to GitHub secrets
- Token must have "Full Account" scope

### "Project not found"
- Verify `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` are correct
- Run `vercel link` in your terminal to get the correct IDs

### "Build failed"
- Check the build logs in GitHub Actions
- Make sure `pnpm build` works locally first

### "Dependencies not found"
- Clear pnpm cache: `pnpm store prune`
- Delete `node_modules` and reinstall: `pnpm install`

---

## 📊 Monitoring Your Deployment

Once deployed, you can monitor:
- **Deployments**: `https://vercel.com/your-username/portfolio`
- **Analytics**: Available in Vercel dashboard
- **Logs**: Real-time logs for each deployment

---

## 🎯 Next Steps

After deployment:
1. ✅ Set up custom domain
2. ✅ Enable Vercel Analytics (free tier available)
3. ✅ Configure preview deployments for PRs
4. ✅ Add deployment status badge to README

**Deployment status badge:**
```markdown
![Deployment](https://img.shields.io/github/deployments/KevinDM15/portfolio/production?label=vercel&logo=vercel)
```

---

## 🔐 Security Notes

- ✅ Never commit `.vercel` folder to git (already in .gitignore)
- ✅ Secrets are encrypted in GitHub
- ✅ Vercel tokens can be regenerated anytime if compromised
- ✅ Use environment-specific secrets for staging/production

---

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

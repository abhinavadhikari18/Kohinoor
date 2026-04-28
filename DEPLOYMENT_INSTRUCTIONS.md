# Restaurant Admin Panel Deployment Instructions

## Overview
Your restaurant website already has a fully functional admin panel with live updates. The admin panel is located at `/admin` and includes:

- **Menu Management**: Add, edit, delete menu items with categories
- **Gallery Management**: Upload photos with drag-and-drop, add titles/descriptions
- **Secure Authentication**: Password-protected admin access
- **Live Updates**: Changes reflect immediately on the live site

## Setup for Production

### 1. Environment Variables
Set these in your Vercel dashboard under Environment Variables:

```bash
# Required - Set a strong password for admin access
ADMIN_PASSWORD=your_secure_admin_password_here

# Required - Set a random secret for session security
ADMIN_SESSION_SECRET=your_random_session_secret_here

# Optional - For automatic live updates when saving
VERCEL_DEPLOY_HOOK_URL=your_vercel_deploy_hook_url_here
```

### 2. Vercel Deploy Hook Setup (Optional but Recommended)
For automatic live updates when you save changes:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git**
3. Under **Deploy Hooks**, click **Create Hook**
4. Name it: `admin-updates`
5. Branch: `main`
6. Copy the generated URL
7. Add it as `VERCEL_DEPLOY_HOOK_URL` in your environment variables

### 3. Accessing the Admin Panel
- URL: `https://your-domain.com/admin`
- Login with the password you set in `ADMIN_PASSWORD`

## Features

### Menu Management
- **Categories**: Organize items by Food Menu, Bar Menu, Beverages
- **Items**: Add/edit name, description, price, veg/non-veg pricing
- **Search**: Find items quickly
- **Live Preview**: Changes save instantly

### Gallery Management
- **Upload Photos**: Drag-and-drop or file picker
- **Image Details**: Add title and description for each photo
- **Reorder**: Drag to rearrange gallery order
- **Multiple Sizes**: Small, Medium, Large display options
- **Live Preview**: See changes in real-time

### Security
- **Secure Sessions**: 7-day login sessions
- **Password Protection**: Only authorized users can access
- **CSRF Protection**: Secure form submissions
- **File Upload Security**: Image type and size validation

## File Storage
Images are stored in `/public/uploads/gallery/` and served directly from your domain.

## Data Storage
Menu and gallery data are stored in JSON files in the `/data/` directory, making backups simple.

## Mobile Responsive
The admin panel works perfectly on desktop and mobile devices.

## Support
If you encounter any issues:
1. Check environment variables are set correctly
2. Ensure the `/data/` directory is writable
3. Verify file permissions for uploads

The admin panel is production-ready and includes all the features you requested for managing your restaurant's menu and gallery content.

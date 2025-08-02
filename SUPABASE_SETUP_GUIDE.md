# 🚀 Supabase Setup Guide for Facilitator Network

## 📋 **Prerequisites**
- Supabase account (free tier available)
- React application ready

## 🗄️ **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose your organization and project name
4. Set a database password (save it securely)
5. Choose your region
6. Wait for project setup to complete

## 🗃️ **Step 2: Database Setup**

### Run SQL Commands in Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the entire content from `supabase_setup.sql` file
4. Click **Run** to execute all commands

This will create:
- `incubation_centers` table with all form fields
- `comments` table for user comments
- Proper indexes for performance
- Row Level Security (RLS) policies
- Sample data for testing

## 🪣 **Step 3: Storage Bucket Setup**

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name it: `incubation-logos`
4. Set it as **Public** (so logos can be accessed)
5. Click **Create bucket**

### Storage Policies (Optional - for additional security)

```sql
-- Allow public read access to logos
CREATE POLICY "Allow public read access to logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'incubation-logos');

-- Allow authenticated users to upload logos
CREATE POLICY "Allow authenticated uploads to logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'incubation-logos');
```

## 🔑 **Step 4: Get API Keys**

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## ⚙️ **Step 5: Environment Configuration**

1. Create a `.env` file in your React project root
2. Add the following variables:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**
```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔄 **Step 6: Install Dependencies**

```bash
npm install @supabase/supabase-js
```

## 🧪 **Step 7: Test the Setup**

1. Start your React application: `npm start`
2. Try registering a new incubation center
3. Check if data appears in your Supabase dashboard
4. Test the comments functionality

## 🔐 **Step 8: Admin Access (Optional)**

For admin functionality to approve centers:

1. Go to **Authentication** → **Users** in Supabase
2. Create an admin user or use your existing account
3. Set up admin role in your application

## 📊 **Database Schema Overview**

### `incubation_centers` Table
- `id` - Primary key
- `company_name` - Company name (for URL matching)
- `company_email` - Contact email
- `company_website` - Website URL
- `unique_selling_point` - USP (max 2 sentences)
- `incubation_center_type` - Type of center
- `location` - Country/Location
- `domain` - Business domain
- `services` - Remote/Onsite/Hybrid
- `startups_incubated` - Number of startups
- `support_remuneration` - Payment model
- `youtube_link` - YouTube video URL
- `incubation_description` - Detailed description
- `logo_url` - Logo file URL
- `is_approved` - Approval status (default: false)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### `comments` Table
- `id` - Primary key
- `center_id` - Foreign key to incubation_centers
- `author_name` - Commenter's name
- `comment_text` - Comment content
- `browser_session_id` - For user identification
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🔍 **Key Features Implemented**

### ✅ **Name Matching Logic**
- URLs use company names (e.g., `/center/technology-transfer-office`)
- Case-insensitive matching in database
- Automatic URL encoding/decoding

### ✅ **Approval System**
- New centers default to `is_approved = false`
- Only approved centers show on home page
- Unapproved centers show "Details Coming Soon" message

### ✅ **Comments System**
- Browser-based user identification
- Users can only delete their own comments
- Confirmation dialog before deletion
- Real-time updates

### ✅ **File Upload**
- Logo uploads to Supabase Storage
- Automatic URL generation
- Public access for display

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists
   - Verify variable names start with `REACT_APP_`
   - Restart your development server

2. **"Failed to upload logo"**
   - Check storage bucket exists and is public
   - Verify storage policies are set correctly

3. **"Failed to fetch data"**
   - Check your API keys are correct
   - Verify RLS policies are set up
   - Check network connectivity

4. **"Comments not working"**
   - Verify comments table exists
   - Check browser session ID generation
   - Ensure RLS policies allow public access

## 📞 **Support**

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify all SQL commands executed successfully
3. Test with the sample data provided
4. Check browser console for error messages

## 🎉 **You're Ready!**

Your Facilitator Network application is now fully integrated with Supabase! 

**Next Steps:**
- Test all functionality
- Customize the approval workflow
- Add admin dashboard (optional)
- Deploy to production 
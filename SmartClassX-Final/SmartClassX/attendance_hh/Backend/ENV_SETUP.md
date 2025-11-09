# Environment Variables Setup

## 🔴 URGENT: You need to create a `.env` file!

The backend server needs environment variables to connect to Supabase. Follow these steps:

---

## Step 1: Create `.env` File

Create a file named `.env` in the `Backend` directory with the following content:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
```

---

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** → Use this for `SUPABASE_URL`
   - **anon public** key → Use this for `SUPABASE_ANON_KEY`
   - **service_role** key → Use this for `SUPABASE_SERVICE_KEY`

---

## Step 3: Update Your `.env` File

Replace the placeholder values with your actual Supabase credentials:

```env
# Example (DO NOT use these exact values - they won't work!)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxxxxxxxxx...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxxxxxxxxx...
PORT=5000
```

---

## Step 4: Restart Your Server

After creating the `.env` file:

```bash
# Stop the server (Ctrl+C if it's running)
# Then start it again
npm start
```

---

## ⚠️ Important Security Notes

1. **NEVER commit the `.env` file to Git!**
   - The `.env` file is already in `.gitignore`
   - It contains sensitive credentials

2. **Keep your SERVICE_KEY secret!**
   - It has admin access to your database
   - Never expose it in frontend code
   - Never share it publicly

3. **Use different keys for development and production**

---

## ✅ Verification

After creating the `.env` file, your server should start without errors.

You should see:
```
🚀 Server running on http://localhost:5000
```

Instead of:
```
Error: supabaseKey is required.
```

---

## 🔍 Troubleshooting

### Error: "supabaseKey is required"
- **Cause**: `.env` file is missing or not in the correct location
- **Solution**: Create `.env` file in the `Backend` directory

### Error: "Invalid API key"
- **Cause**: Wrong API keys in `.env` file
- **Solution**: Double-check your Supabase dashboard for correct keys

### Server still crashes
- **Cause**: `.env` file has syntax errors
- **Solution**: Make sure there are no spaces around the `=` sign
  - ✅ Correct: `SUPABASE_URL=https://...`
  - ❌ Wrong: `SUPABASE_URL = https://...`

---

## 📝 Template to Copy

Create a file named `.env` in the `Backend` directory and paste this:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
PORT=5000
```

Then fill in the values from your Supabase dashboard.

---

**Need help?** Check the main documentation or contact support!


# 🔴 FIX: "supabaseKey is required" Error

## Quick Fix (2 Minutes)

### Step 1: Create `.env` File

In the `Backend` directory, create a new file named `.env` (exactly like that, with the dot at the start).

**On Windows:**
```bash
# In PowerShell or Command Prompt, inside the Backend directory:
New-Item -Path ".env" -ItemType File

# Or use Notepad:
notepad .env
```

**On Mac/Linux:**
```bash
touch .env
```

---

### Step 2: Add Your Supabase Credentials

Open the `.env` file and paste this:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
PORT=5000
```

---

### Step 3: Get Your Keys from Supabase

1. Go to: https://supabase.com/dashboard
2. Click on your project
3. Click **Settings** (gear icon on the left)
4. Click **API**
5. Copy these values:
   - **URL** → Project URL
   - **anon public** → anon key
   - **service_role** → service key (click "Reveal" first)

---

### Step 4: Replace Placeholder Values

Your `.env` file should look like this (with YOUR actual values):

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmF...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmF...
PORT=5000
```

---

### Step 5: Save and Restart Server

1. Save the `.env` file
2. Stop your server (press `Ctrl+C`)
3. Start it again:
   ```bash
   npm start
   ```

---

## ✅ Success!

You should now see:
```
🚀 Server running on http://localhost:5000
```

Instead of the error!

---

## 🎯 Visual Guide

```
Backend/
├── .env          ← Create this file!
├── server.js
├── package.json
└── routes/
    └── fingerprintRoutes.js
```

---

## ⚠️ Important Notes

1. **The `.env` file MUST be in the `Backend` directory** (same location as `server.js`)
2. **No spaces around the `=` sign**
   - ✅ `SUPABASE_URL=https://...`
   - ❌ `SUPABASE_URL = https://...`
3. **Keep your service key secret!** Never commit it to Git
4. **The `.env` file is already in `.gitignore`** so it won't be committed

---

## 🐛 Still Having Issues?

### Issue: File not found
- Make sure the file is named **exactly** `.env` (with the dot!)
- Not `env.txt`, not `.env.txt`, not `dot_env`

### Issue: Keys don't work
- Make sure you copied the FULL key (they're very long!)
- Make sure there are no extra spaces or line breaks
- Check you're using keys from the correct Supabase project

### Issue: Can't create `.env` file on Windows
```bash
# Use this command in PowerShell:
New-Item -Path ".env" -ItemType File -Force

# Then edit it with:
notepad .env
```

---

## 📸 Screenshot Guide

**Where to find your keys in Supabase:**

1. Dashboard → Your Project → Settings → API
2. Look for:
   - **Project URL** section
   - **Project API keys** section
   - Click "Reveal" on the service_role key

---

## 💡 Pro Tip

You can also copy from an existing `.env` file if you have one elsewhere in your project. Just make sure it has all three Supabase keys!

---

**That's it! Your server should now start successfully!** 🚀


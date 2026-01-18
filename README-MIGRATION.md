# Quick Start - PocketBase Migration

## 1️⃣ Install Dependencies

Run the setup script:
```bash
.\setup-migration.bat
```

Or manually:
```bash
npm install pocketbase gray-matter marked
npm install --save-dev tsx @types/node typescript
```

## 2️⃣ Configure PocketBase Connection

Create `.env` file:
```bash
copy .env.migration .env
```

Edit `.env` with your PocketBase credentials:
```env
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_EMAIL=your-admin@email.com
POCKETBASE_PASSWORD=your-password
```

## 3️⃣ Run Migration

```bash
npx tsx migrate-to-pocketbase.ts
```

Or add to your package.json scripts and run:
```bash
npm run migrate
```

## 📋 What Gets Migrated

### Portfolio Items (42 files)
- ✅ Frontmatter → PocketBase fields
- ✅ Cover images → `images` collection
- ✅ Markdown content → HTML in `content` field
- ✅ Embedded images → `images` collection
- ✅ Category mapping

### Projects (7 files)
- ✅ Same as portfolio, stored in `portfolio` collection
- ✅ Category set to "Project"

### Pages (3 files)
- ✅ Markdown → HTML
- ✅ Stored in `pages` collection

## 📊 Expected Output

```
🚀 Starting PocketBase Migration...
✅ Authenticated with PocketBase

📁 Migrating Portfolio Items...
📄 Processing: halo-girl.mdoc
  📤 Uploaded image: image.jpg (ID: abc...)
  ✅ Created portfolio record (ID: xyz...)

📊 Portfolio Migration Summary: 42 success, 0 errors
📊 Projects Migration Summary: 7 success, 0 errors
📊 Pages Migration Summary: 3 success, 0 errors

✨ Migration completed!
📈 Total images uploaded: 85
```

## 🔍 Verify Migration

After running, check PocketBase Admin UI:
1. Open `http://127.0.0.1:8090/_/`
2. Check **images** collection → Should have ~85 images
3. Check **portfolio** collection → Should have ~49 items
4. Check **pages** collection → Should have ~3 pages

## ⚙️ Category Mapping

The script maps your categories to PocketBase schema:
- `digital-art` → `Drawing`
- `illustration` → `Portrait`
- `sketch` → `Sketch`
- Projects → `Project`

## 🛠️ Troubleshooting

**Can't connect to PocketBase?**
- Verify PocketBase is running: `http://127.0.0.1:8090`
- Check credentials in `.env`

**Images not uploading?**
- Verify image paths in mdoc files
- Check images exist in `src/assets/images/` or `public/images/`

**Need more help?**
- See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed documentation

---

## Files Created

- ✅ `migrate-to-pocketbase.ts` - Main migration script
- ✅ `package-migration.json` - Dependencies reference
- ✅ `.env.migration` - Environment template
- ✅ `MIGRATION_GUIDE.md` - Detailed documentation
- ✅ `README-MIGRATION.md` - This quick start guide
- ✅ `setup-migration.bat` - Windows setup script

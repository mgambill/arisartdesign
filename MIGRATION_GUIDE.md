# PocketBase Migration Guide

This guide will help you migrate your Ari's Art Design content to PocketBase.

## Prerequisites

1. **PocketBase Instance Running**
   - Make sure your PocketBase instance is running locally or remotely
   - Default URL: `http://127.0.0.1:8090`

2. **PocketBase Collections**
   - Your PocketBase instance should already have these collections configured:
     - `images` - for storing image files
     - `portfolio` - for portfolio and project items
     - `pages` - for static pages

## Installation

1. **Install Migration Dependencies**
   ```bash
   npm install --prefix . --save pocketbase gray-matter marked
   npm install --prefix . --save-dev tsx @types/node typescript
   ```

   Or if you prefer to use a separate package.json:
   ```bash
   cp package-migration.json package-migration-backup.json
   npm install --package-lock-only -C .
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the template
   cp .env.migration .env

   # Edit .env and add your PocketBase credentials
   ```

   Edit `.env`:
   ```
   POCKETBASE_URL=http://127.0.0.1:8090
   POCKETBASE_EMAIL=admin@example.com
   POCKETBASE_PASSWORD=your-secure-password
   ```

## Running the Migration

### Option 1: Using npm script

```bash
npm run migrate
```

### Option 2: Direct execution with tsx

```bash
npx tsx migrate-to-pocketbase.ts
```

### Option 3: With environment variables inline

```bash
POCKETBASE_URL=http://127.0.0.1:8090 \
POCKETBASE_EMAIL=admin@example.com \
POCKETBASE_PASSWORD=yourpassword \
npx tsx migrate-to-pocketbase.ts
```

## What the Migration Does

The script will:

1. **Authenticate** with your PocketBase instance using admin credentials

2. **Process Portfolio Items** (`src/content/portfolio/*.mdoc`)
   - Parse YAML frontmatter (title, category, public, etc.)
   - Upload cover images to `images` collection
   - Extract and upload embedded images from markdown content
   - Convert markdown content to HTML
   - Create records in `portfolio` collection with proper relations
   - Map categories: `digital-art` → `Drawing`, `illustration` → `Portrait`, `sketch` → `Sketch`

3. **Process Projects** (`src/content/projects/*.mdoc`)
   - Parse frontmatter
   - Upload cover and content images
   - Convert markdown to HTML
   - Create records in `portfolio` collection with category `Project`

4. **Process Pages** (`src/content/pages/*.mdoc`)
   - Convert markdown content to HTML
   - Create records in `pages` collection

## Migration Output

The script provides detailed console output:

```
🚀 Starting PocketBase Migration...

✅ Authenticated with PocketBase

📁 Migrating Portfolio Items...

📄 Processing: halo-girl.mdoc
  📤 Uploaded image: image.jpg (ID: abc123...)
  ✅ Created portfolio record (ID: xyz789...)

...

📊 Portfolio Migration Summary: 42 success, 0 errors
📊 Projects Migration Summary: 7 success, 0 errors
📊 Pages Migration Summary: 3 success, 0 errors

✨ Migration completed!
📈 Total images uploaded: 85
```

## Troubleshooting

### Authentication Failed
- Verify your PocketBase URL is correct
- Ensure admin credentials are correct
- Check if PocketBase is running: visit URL in browser

### Image Upload Fails
- Check file paths in mdoc frontmatter
- Ensure image files exist in `src/assets/images/` or `public/images/`
- Verify PocketBase has write permissions

### Collection Not Found
- Verify your PocketBase collections match the schema provided
- Check collection names: `images`, `portfolio`, `pages`

### Category Mapping Issues
The script maps categories as follows:
- `digital-art` → `Drawing`
- `illustration` → `Portrait`
- `sketch` → `Sketch`
- Projects → `Project`

If your PocketBase schema has different category values, update the `categoryMap` in the migration script.

## Post-Migration

After successful migration:

1. **Verify Data in PocketBase**
   - Open PocketBase Admin UI
   - Check `images`, `portfolio`, and `pages` collections
   - Verify image uploads and relations

2. **Update Your Application**
   - Update your frontend to fetch data from PocketBase
   - Replace Astro content collections with PocketBase queries
   - Update image URLs to use PocketBase file URLs

3. **Backup**
   - Export PocketBase data for backup
   - Keep original mdoc files as backup

## Example PocketBase Query

After migration, fetch portfolio items:

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Get all portfolio items with images
const records = await pb.collection('portfolio').getFullList({
  expand: 'cover,images',
  sort: '-created',
});

// Access data
records.forEach(record => {
  console.log(record.title);
  console.log(record.slug);

  // Cover image URL
  if (record.expand?.cover) {
    const imageUrl = pb.files.getUrl(record.expand.cover, record.expand.cover.image);
    console.log(imageUrl);
  }
});
```

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your PocketBase schema matches the expected format
3. Ensure all file paths are correct
4. Check PocketBase server logs for backend errors

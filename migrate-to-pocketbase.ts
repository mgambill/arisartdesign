import PocketBase from 'pocketbase';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename, extname, relative } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const POCKETBASE_EMAIL = process.env.POCKETBASE_EMAIL || '';
const POCKETBASE_PASSWORD = process.env.POCKETBASE_PASSWORD || '';

const pb = new PocketBase(POCKETBASE_URL);

interface PortfolioMatter {
  title: string;
  category?: string;
  public?: boolean;
  showOnHome?: boolean;
  image?: string;
}

interface ProjectMatter {
  title: string;
  public?: boolean;
  image?: string;
}

interface PageMatter {
  title?: string;
}

// Mapping for categories to match PocketBase schema
const categoryMap: Record<string, string> = {
  'digital-art': 'Drawing',
  'illustration': 'Portrait',
  'sketch': 'Sketch',
};

// Uploaded images cache to avoid duplicates
const uploadedImages = new Map<string, string>();

/**
 * Authenticate with PocketBase
 */
async function authenticate() {
  try {
    await pb.admins.authWithPassword(POCKETBASE_EMAIL, POCKETBASE_PASSWORD);
    console.log('✅ Authenticated with PocketBase');
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    throw error;
  }
}

/**
 * Upload an image file to PocketBase images collection
 */
async function uploadImage(imagePath: string, title: string): Promise<string | null> {
  try {
    // Check if already uploaded
    if (uploadedImages.has(imagePath)) {
      console.log(`  ↩️  Image already uploaded: ${basename(imagePath)}`);
      return uploadedImages.get(imagePath)!;
    }

    const imageBuffer = readFileSync(imagePath);
    const filename = basename(imagePath);

    // Create a File-like object for PocketBase
    const imageFile = new File([imageBuffer], filename, {
      type: `image/${extname(filename).slice(1)}`,
    });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);
    formData.append('enabled', 'true');

    const record = await pb.collection('images').create(formData);

    uploadedImages.set(imagePath, record.id);
    console.log(`  📤 Uploaded image: ${filename} (ID: ${record.id})`);

    return record.id;
  } catch (error) {
    console.error(`  ❌ Failed to upload image ${imagePath}:`, error);
    return null;
  }
}

/**
 * Resolve image path from mdoc file
 */
function resolveImagePath(mdocFilePath: string, imagePath: string): string {
  // Remove leading ../../ and resolve relative to project root
  const cleanPath = imagePath.replace(/^\.\.\//, '');
  const rootDir = process.cwd();

  // Try src/assets first
  let fullPath = join(rootDir, 'src', cleanPath);
  if (statSync(fullPath, { throwIfNoEntry: false })) {
    return fullPath;
  }

  // Try public directory
  fullPath = join(rootDir, 'public', cleanPath.replace('assets/', ''));
  if (statSync(fullPath, { throwIfNoEntry: false })) {
    return fullPath;
  }

  return '';
}

/**
 * Extract and upload images from markdown content
 */
async function extractAndUploadImagesFromContent(
  content: string,
  mdocFilePath: string,
  itemTitle: string
): Promise<{ content: string; imageIds: string[] }> {
  const imageIds: string[] = [];

  // Find all markdown images: ![alt](path)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const [, alt, imagePath] = match;
    const fullImagePath = resolveImagePath(mdocFilePath, imagePath);

    if (fullImagePath) {
      const imageId = await uploadImage(fullImagePath, alt || itemTitle);
      if (imageId) {
        imageIds.push(imageId);
      }
    }
  }

  return { content, imageIds };
}

/**
 * Convert markdown to HTML
 */
function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

/**
 * Migrate portfolio items
 */
async function migratePortfolio() {
  console.log('\n📁 Migrating Portfolio Items...');

  const portfolioDir = join(process.cwd(), 'src', 'content', 'portfolio');
  const files = readdirSync(portfolioDir).filter(f => f.endsWith('.mdoc'));

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = join(portfolioDir, file);
    const slug = basename(file, '.mdoc');

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent) as { data: PortfolioMatter; content: string };

      console.log(`\n📄 Processing: ${file}`);

      // Upload cover image
      let coverImageId: string | null = null;
      if (data.image) {
        const coverPath = resolveImagePath(filePath, data.image);
        if (coverPath) {
          coverImageId = await uploadImage(coverPath, data.title || slug);
        }
      }

      // Extract and upload images from content
      const { content: processedContent, imageIds } = await extractAndUploadImagesFromContent(
        content,
        filePath,
        data.title || slug
      );

      // Convert markdown to HTML
      const htmlContent = processedContent.trim() ? markdownToHtml(processedContent) : '';

      // Map category
      const category = data.category ? (categoryMap[data.category] || 'Drawing') : undefined;

      // Create portfolio record
      const portfolioData: Record<string, any> = {
        title: data.title || '',
        slug: slug,
        content: htmlContent,
        category: category,
      };

      // Add cover image if exists
      if (coverImageId) {
        portfolioData.cover = coverImageId;
      }

      // Add additional images
      if (imageIds.length > 0) {
        portfolioData.images = imageIds;
      }

      const record = await pb.collection('portfolio').create(portfolioData);
      console.log(`  ✅ Created portfolio record (ID: ${record.id})`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Failed to migrate ${file}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Portfolio Migration Summary: ${successCount} success, ${errorCount} errors`);
}

/**
 * Migrate project items
 */
async function migrateProjects() {
  console.log('\n📁 Migrating Projects...');

  const projectsDir = join(process.cwd(), 'src', 'content', 'projects');
  const files = readdirSync(projectsDir).filter(f => f.endsWith('.mdoc'));

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = join(projectsDir, file);
    const slug = basename(file, '.mdoc');

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent) as { data: ProjectMatter; content: string };

      console.log(`\n📄 Processing: ${file}`);

      // Upload cover image
      let coverImageId: string | null = null;
      if (data.image) {
        const coverPath = resolveImagePath(filePath, data.image);
        if (coverPath) {
          coverImageId = await uploadImage(coverPath, data.title || slug);
        }
      }

      // Extract and upload images from content
      const { content: processedContent, imageIds } = await extractAndUploadImagesFromContent(
        content,
        filePath,
        data.title || slug
      );

      // Convert markdown to HTML
      const htmlContent = markdownToHtml(processedContent);

      // Create portfolio record (using category "Project")
      const portfolioData: Record<string, any> = {
        title: data.title || '',
        slug: slug,
        content: htmlContent,
        category: 'Project',
      };

      if (coverImageId) {
        portfolioData.cover = coverImageId;
      }

      if (imageIds.length > 0) {
        portfolioData.images = imageIds;
      }

      const record = await pb.collection('portfolio').create(portfolioData);
      console.log(`  ✅ Created project record (ID: ${record.id})`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Failed to migrate ${file}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Projects Migration Summary: ${successCount} success, ${errorCount} errors`);
}

/**
 * Migrate pages
 */
async function migratePages() {
  console.log('\n📁 Migrating Pages...');

  const pagesDir = join(process.cwd(), 'src', 'content', 'pages');
  const files = readdirSync(pagesDir).filter(f => f.endsWith('.mdoc'));

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = join(pagesDir, file);
    const slug = basename(file, '.mdoc');

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent) as { data: PageMatter; content: string };

      console.log(`\n📄 Processing: ${file}`);

      // Convert markdown to HTML
      const htmlContent = markdownToHtml(content);

      // Create page record
      const pageData = {
        slug: slug,
        content: htmlContent,
      };

      const record = await pb.collection('pages').create(pageData);
      console.log(`  ✅ Created page record (ID: ${record.id})`);
      successCount++;

    } catch (error) {
      console.error(`  ❌ Failed to migrate ${file}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Pages Migration Summary: ${successCount} success, ${errorCount} errors`);
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting PocketBase Migration...\n');
  console.log(`PocketBase URL: ${POCKETBASE_URL}\n`);

  try {
    // Authenticate
    await authenticate();

    // Migrate content
    await migratePortfolio();
    await migrateProjects();
    await migratePages();

    console.log('\n✨ Migration completed!\n');
    console.log(`📈 Total images uploaded: ${uploadedImages.size}`);

  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main();

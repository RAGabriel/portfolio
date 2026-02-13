
# Electronic Engineer Portfolio

## Project and Image Management

This portfolio loads projects dynamically from JSON and Markdown files.

### 📁 Folder Structure (Important for Deployment)

To ensure your projects and images appear on the published site (GitHub Pages), you must use the `public` folder.

The recommended structure is:

```
/public
  /projects
    manifest.json       <-- List of Project IDs
    /project01
      config.json       <-- Project metadata
      /images           <-- Place your images here
        photo.jpg
      /text
        details.md      <-- Detailed description
```

### 🖼️ Inserting Images

**Method 1: Local Images (Recommended)**
1. Place the image in the `images` folder within the project directory (e.g. `public/projects/project01/images/my-circuit.jpg`).
2. In `config.json`, reference only the filename:
   ```json
   "featuredImage": "my-circuit.jpg"
   ```

**Method 2: External URLs**
Use the full link to the image:
```json
"featuredImage": "https://example.com/image.jpg"
```

### ➕ Adding a New Project

1. Create a new folder in `public/projects/` (e.g. `my-new-project`).
2. Create the `config.json` and `text/details.md` files following the existing models.
3. Add the folder name (ID) to the `public/projects/manifest.json` file.

# Electronic Engineer Portfolio

## Adding a New Project

Projects are added using the **Project Generator** tool located in the `_tools/` folder. This tool generates all required files automatically — no manual editing needed.

### Step-by-step

1. Open `_tools/project_generator.html` in your browser (double-click the file)
2. Fill in the form:
   - **Last ID used** — enter the number of the last project added (e.g. `4`)
   - **Project title** — the name of the project
   - **Category** — select from the dropdown
   - **Description** — short text that appears on the project card
   - **Materials / Stack** — components and technologies used
   - **Results** — outcomes and key learnings
   - **Technologies / Tags** — used as filters on the portfolio page
   - **Images** — drag and drop your images; click one to set it as the featured image
3. Click **"Generate & Download ZIP"**
4. Extract the ZIP into `public/projects/` — the project folder is created automatically with the correct structure
5. Open `public/projects/manifest.json` with any text editor and replace its contents with the updated manifest shown by the tool
6. Open **GitHub Desktop**, commit the changes, and click **Push origin**

---

## Project Structure

Each project lives in its own folder inside `public/projects/`:

```
public/
  projects/
    manifest.json              ← list of all project IDs
    project01/
      config.json              ← project metadata (generated automatically)
      images/
        featured.jpg           ← featured image (appears on card)
        other.jpg
      text/
        details.md             ← full project description (Markdown)
```

### manifest.json

A simple JSON array listing all project folder names in the order they should appear:

```json
["project01", "project02", "project03"]
```

### config.json reference

```json
{
  "title": "Project Title",
  "category": "Embedded Systems",
  "description": "Short description shown on the project card.",
  "materials": "• Processor: ESP32\n• Language: C++",
  "results": "Description of outcomes and key learnings.",
  "tech": ["ESP32", "C++", "MQTT"],
  "featuredImage": "photo.jpg",
  "otherImages": ["photo2.jpg", "photo3.jpg"],
  "githubUrl": "https://github.com/your-username/project"
}
```

> `githubUrl` is optional — omit it if the project has no repository link.

### details.md

A standard Markdown file displayed on the project's inner page. If left blank in the generator, it is auto-generated from the form fields.

```markdown
# Project Title

## Description
Full description here.

## Materials
- ESP32
- C++

## Results
What was achieved.
```

---

## Project ID Convention

Project folders follow a sequential numeric naming convention:

| Folder | ID |
|---|---|
| First project | `project01` |
| Second project | `project02` |
| And so on... | `project03` |

The generator handles this automatically — just enter the last ID used and it calculates the next one.

---

## Available Categories

- Embedded Systems
- Hardware Design
- Mechanical Design
- Sensors

---

## Local Development

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:5173`.

## Deployment

Deployment is handled automatically via GitHub Actions on every push to the `main` branch. No manual steps required.

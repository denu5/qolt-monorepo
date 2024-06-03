# QOLT-MONOREPO

## Project Structure

This project uses npm workspaces and Turborepo to manage its packages and dependencies efficiently. Below is an overview of the main applications in this project and their dependencies.

### Root Directory
The root directory includes:
- **package.json**: Configures npm workspaces and sets up project-wide dependencies.

```json
{
    "name": "qolt-monorepo",
    "workspaces": [
        "apps/*",
        "packages/*"
    ],
...
```

### Apps Directory
The `apps` directory contains the main applications:
- **dev**: The dev&experiment application
- **insta-lr**: The Instagram clone application
- **github-lists**: The GitHub repository list application
...

### Packages Directory
The `packages` directory contains several packages used by the apps:
- **@qolt/app-components**: Shared components across the applications.
- **@qolt/app-contentlayer**: Handles content layers for the applications.
- **@qolt/data-lightroom**: Integrates Adobe Lightroom data.
- **@qolt/data-github**: Integrates GitHub data.
...


## Monorepo Management

### npm Workspaces

npm workspaces allow managing multiple packages within a single repository. This setup enables shared dependencies, easier refactoring, and consistent versioning across the project.

### Turborepo

Turborepo is a high-performance build system for JavaScript and TypeScript codebases. It optimizes build and development processes by caching previous builds and running tasks in parallel, significantly speeding up the workflow in a monorepo setup.

By using npm workspaces and Turborepo, this project efficiently manages dependencies and packages, ensuring smooth development and integration across multiple applications.

---

## Typical Project Structure

```
project-root/
├── apps/
│   ├── github-lists/
│   │   ├── README.md
│   │   ├── package.json
│   │   └── src/
│   ├── insta-lr/
│   │   ├── README.md
│   │   ├── package.json
│   │   └── src/
│   └── ...
├── packages/
│   ├── app-components/
│   │   ├── package.json
│   │   └── src/
│   ├── app-contentlayer/
│   │   ├── package.json
│   │   └── src/
│   ├── data-lightroom/
│   │   ├── package.json
│   │   └── src/
│   ├── data-github/
│   │   ├── package.json
│   │   └── src/
│   └── ...
├── node_modules/
│   └── ...
├── package.json
├── package-lock.json
└── README.md
```


# Apps Showcase


## INSTA-LR

### 📷 Instagram Clone x Adobe Lightroom Albums

Manage and display photo albums via MDX files and Adobe Lightroom Album-Sharing as API.

**Dependencies:**
- `@googlemaps/markerclusterer`: ^2.5.3
- `@qolt/app-components`: *
- `@qolt/app-contentlayer`: *
- `@qolt/data-lightroom`: *
- `@vis.gl/react-google-maps`: ^1.0.2
- `geolib`: ^3.3.4

For more details, refer to the [INSTA-LR README](/apps/insta-lr/README.md).

---

## GITHUB-LISTS

### ⭐ GitHub List Bookmarks

Manage and display lists of GitHub repos using MDX files and GitHub Stars/Lists for repo data with the GitHub API.

**Dependencies:**
- `@qolt/app-components`: *
- `@qolt/app-contentlayer`: *
- `@qolt/data-github`: *

For more details, refer to the [GITHUB-LISTS README](/apps/github-lists/README.md).

# Directory Visualizer

**Directory Visualizer** is a Node.js application that generates a visual representation of a directory's structure in multiple formats, including YAML, JSON, and tree-style text output. The tool is highly configurable and supports excluding specified directories from detailed output.

## Features

- **Recursive Directory Traversal**: Visualize the structure of nested directories and files.
- **Multiple Output Formats**: Export directory structures as:
  - Tree-style text
  - YAML
  - JSON
- **Exclude Directories**: Mark specific directories (e.g., `node_modules`, `dist`) to be summarized as `...` in the output.
- **Top-Level Directory Customization**: Includes the top-level directory as part of the output structure.

## Requirements

- **Node.js**: Ensure Node.js (v12 or later) is installed on your system.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SKAGAWA0401/directory-viz.git
cd directory-viz
```

2. Install any required dependencies (if applicable).


## Usage

```bash
node index.js <target-directory> <output-format> [excluded-directories]
```

### Arguments:

- `<target-directory>`: The path to the directory you want to visualize.
- `<output-format>`: The format for the output file.
- Options:
  - tree: Tree-style text output.
  - yaml: YAML format.
  - json: JSON format.
- `[excluded-directories]` (optional): A comma-separated list of directory names to exclude (e.g., node_modules,dist).

### Example:
Generate a YAML representation of the /path/to/project directory while excluding node_modules and dist:
```bash
node index.js /path/to/project yaml node_modules,dist
```
Output will be saved in the output directory as `directory-structure.yaml`.

## Output Format

### tree
```text
my-project
├── public
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src
│   ├── app.js
│   └── utils.js
├── node_modules (...omitted)
├── dist (...omitted)
└── README.md
```

### yaml
```yaml
my-project:
  public:
    - index.html
    - manifest.json
    - service-worker.js
  src:
    - app.js
    - utils.js
  node_modules: ...omitted
  dist: ...omitted
  - README.md
```

### json
```json
[
  {
    "name": "my-project",
    "value": [
      { "name": "public", "value": [...] },
      { "name": "src", "value": [...] },
      { "name": "node_modules", "value": "...omitted" },
      { "name": "dist", "value": "...omitted" },
      { "name": "README.md", "value": null }
    ]
  }
]
```




# Markdown to JSON Sanitizer

This directory contains scripts to sanitize markdown files for use as JSON string values.

## Scripts

### Node.js Version
- **File**: `sanitize-markdown.js`
- **Usage**: `node sanitize-markdown.js <input-file.md> [output-file.txt]`

### Python Version
- **File**: `sanitize-markdown.py`
- **Usage**: `python3 sanitize-markdown.py <input-file.md> [output-file.txt]`

## What It Does

The scripts take a markdown file and convert it to a single-line escaped string suitable for JSON:

1. **Escapes backslashes** (`\` → `\\`)
2. **Escapes double quotes** (`"` → `\"`)
3. **Replaces newlines** (`\n` → `\\n`)
4. **Removes carriage returns** (`\r` → removed)

## Examples

### Basic Usage

```bash
# Output to stdout
node sanitize-markdown.js FiletoJSON.md

# Output to file
node sanitize-markdown.js FiletoJSON.md sanitized-output.txt
```

### Using in JSON

After sanitizing, you can use the output directly in a JSON file:

```json
{
  "prompt_template": "# Context\nYou are the File → Structured Content JSON agent..."
}
```

## Example Output

**Input** (markdown):
```markdown
# Context
You are the File → Structured Content JSON agent.

Your job is to take a single uploaded file (PDF, Word, PowerPoint, Excel, or similar) and return only the document's own content in a structured JSON format.
* The input is a FILE, not pre-structured JSON.
```

**Output** (sanitized string):
```
# Context\nYou are the File → Structured Content JSON agent.\n\nYour job is to take a single uploaded file (PDF, Word, PowerPoint, Excel, or similar) and return only the document's own content in a structured JSON format.\n* The input is a FILE, not pre-structured JSON.
```

## Notes

- The scripts preserve all original content, only escaping special characters
- Both scripts produce identical output
- Use the Node.js version if you have Node.js installed
- Use the Python version if you prefer Python or don't have Node.js


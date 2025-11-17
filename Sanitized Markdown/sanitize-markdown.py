#!/usr/bin/env python3
"""
Sanitize Markdown for JSON

Takes a markdown file as input and outputs a single escaped string
suitable to be included as a JSON value.

Usage:
    python3 sanitize-markdown.py <input-file.md> [output-file.txt]

If output-file is not specified, outputs to stdout.
"""

import sys
import os

def sanitize_markdown(content):
    """
    Sanitize markdown content for JSON:
    1. Escape backslashes first (must be done before other escapes)
    2. Escape double quotes
    3. Escape all control characters (0-31) including:
       - \n (newline) -> \\n
       - \r (carriage return) -> \\r
       - \t (tab) -> \\t
       - Other control chars -> \\uXXXX format
    """
    import re
    
    # Escape backslashes first (must be done before other escapes)
    sanitized = content.replace('\\', '\\\\')
    
    # Escape double quotes
    sanitized = sanitized.replace('"', '\\"')
    
    # Escape control characters (ASCII 0-31)
    # Handle common ones explicitly for readability
    sanitized = sanitized.replace('\n', '\\n')  # Newline
    sanitized = sanitized.replace('\r', '\\r')  # Carriage return
    sanitized = sanitized.replace('\t', '\\t')  # Tab
    
    # Escape any remaining control characters (0-31) using \uXXXX format
    def escape_control_char(match):
        char = match.group(0)
        code = ord(char)
        if code < 32:
            return f'\\u{code:04x}'
        return char
    
    # Match any remaining control characters (0-31) that aren't \n, \r, or \t
    sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', escape_control_char, sanitized)
    
    return sanitized

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 sanitize-markdown.py <input-file.md> [output-file.txt]', file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f'Error: Input file "{input_file}" does not exist.', file=sys.stderr)
        sys.exit(1)
    
    # Read the markdown file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
    except Exception as e:
        print(f'Error reading file "{input_file}": {e}', file=sys.stderr)
        sys.exit(1)
    
    # Sanitize the content
    sanitized = sanitize_markdown(markdown_content)
    
    # Output the sanitized content
    if output_file:
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(sanitized)
            print(f'✓ Sanitized content written to "{output_file}"')
            print(f'  Original length: {len(markdown_content)} characters')
            print(f'  Sanitized length: {len(sanitized)} characters')
        except Exception as e:
            print(f'Error writing to file "{output_file}": {e}', file=sys.stderr)
            sys.exit(1)
    else:
        # Output to stdout
        sys.stdout.write(sanitized)

if __name__ == '__main__':
    main()


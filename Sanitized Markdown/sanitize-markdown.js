#!/usr/bin/env node

/**
 * Sanitize Markdown for JSON
 * 
 * Takes a markdown file as input and outputs a single escaped string
 * suitable to be included as a JSON value.
 * 
 * Usage:
 *   node sanitize-markdown.js <input-file.md> [output-file.txt]
 * 
 * If output-file is not specified, outputs to stdout.
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: node sanitize-markdown.js <input-file.md> [output-file.txt]');
    process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

// Check if input file exists
if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" does not exist.`);
    process.exit(1);
}

// Read the markdown file
let markdownContent;
try {
    markdownContent = fs.readFileSync(inputFile, 'utf-8');
} catch (error) {
    console.error(`Error reading file "${inputFile}":`, error.message);
    process.exit(1);
}

// Sanitize the content:
// 1. Escape backslashes first (must be done before other escapes)
// 2. Escape double quotes
// 3. Escape apostrophes (both straight ' and curly ')
// 4. Escape all control characters (0-31) including:
//    - \n (newline) -> \\n
//    - \r (carriage return) -> \\r
//    - \t (tab) -> \\t
//    - Other control chars -> \\uXXXX format
let sanitized = markdownContent
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/"/g, '\\"')    // Escape double quotes
    .replace(/'/g, "\\'")    // Escape straight apostrophes
    .replace(/\u2019/g, '\\u2019')  // Escape right single quotation mark (U+2019)
    .replace(/\u2018/g, '\\u2018')  // Escape left single quotation mark (U+2018)
    .replace(/\u201C/g, '\\u201C')  // Escape left double quotation mark (U+201C)
    .replace(/\u201D/g, '\\u201D')  // Escape right double quotation mark (U+201D)
    .replace(/\n/g, '\\n')  // Replace newlines with \n
    .replace(/\r/g, '\\r')  // Replace carriage returns with \r
    .replace(/\t/g, '\\t'); // Replace tabs with \t

// Escape any remaining control characters (0-31) using \uXXXX format
// This handles characters that aren't \n, \r, or \t
sanitized = sanitized.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, (char) => {
    const code = char.charCodeAt(0);
    return `\\u${code.toString(16).padStart(4, '0')}`;
});

// Output the sanitized content
if (outputFile) {
    try {
        fs.writeFileSync(outputFile, sanitized, 'utf-8');
        console.log(`✓ Sanitized content written to "${outputFile}"`);
        console.log(`  Original length: ${markdownContent.length} characters`);
        console.log(`  Sanitized length: ${sanitized.length} characters`);
    } catch (error) {
        console.error(`Error writing to file "${outputFile}":`, error.message);
        process.exit(1);
    }
} else {
    // Output to stdout
    process.stdout.write(sanitized);
}


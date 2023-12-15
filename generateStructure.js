const fs = require('fs');
const path = require('path');

/**
 * This function recursively traverses the directories of a given path
 * and returns a string representation of the structure.
 *
 * @param {string} dirPath - The starting directory path.
 * @param {number} depth - The starting depth to determine the level of indentation.
 * @return {string} The directory tree as a string.
 */
function generateDirectoryTree(dirPath, depth = 0) {
    let tree = '';

    // Get all items in the current directory
    const list = fs.readdirSync(dirPath);
    list.forEach(item => {
        // Ignore node_modules directory and hidden files
        if (item === 'node_modules' || item.startsWith('.')) return;

        const filePath = path.join(dirPath, item);
        const stats = fs.statSync(filePath);

        // Add indentation for readability and file/directory indicator
        tree += `${' '.repeat(depth * 4)}${stats.isDirectory() ? '+' : '-'} ${item}\n`;

        // If the item is a directory, recursively call this function
        if (stats.isDirectory()) {
            tree += generateDirectoryTree(filePath, depth + 1);
        }
    });

    return tree;
}

// Start from the current directory or a specified directory
const projectRoot = process.argv[2] || '.';
const treeStructure = generateDirectoryTree(projectRoot);

// Output the directory tree to the console or a file
console.log(treeStructure);
fs.writeFileSync('project-structure.txt', treeStructure);
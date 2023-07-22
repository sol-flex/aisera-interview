const fs = require('fs');

// Read the file content
fs.readFile('sample_dataset.csv', 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data)
    
    // Replace " with whitespace
    const newContent = data.replace(/"/g, ' ');
    
    // Write the modified content back to the file
    fs.writeFile('sample_dataset_clean.csv', newContent, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});


// import { readdirSync } from 'fs';
// import * as path from 'path';
// import * as fs from 'fs';

// function listFilesByType(folderPath, fileType) {
//     try {
//         // Read all items in the folder
//         const files = readdirSync(folderPath);

//         // Filter files by the specified type (extension)
//         const filteredFiles = files.filter(file => path.extname(file) === fileType);

//         return filteredFiles;
//     } catch (error) {
//         console.error(`Error reading folder: ${error.message}`);
//         return [];
//     }
// }

// function listFilesByType(folderPath, fileType) {
//     try {
//         // Read all items in the folder
//         const files = fs.readdirSync(folderPath);

//         // Filter files by the specified type (extension)
//         const filteredFiles = files.filter(file => path.extname(file) === fileType);

//         return filteredFiles;
//     } catch (error) {
//         console.error(`Error reading folder: ${error.message}`);
//         return [];
//     }
// }

export default function readWorkflowdirs() {
    // const distWorkflows = listFilesByType('@/assets/workflows','json');
    
    // @TODO: error handling for when dir doesnt exist
    // const userWorkflows = listFilesByType('@/workflows', 'json');


    // console.log(userWorkflows.concat(distWorkflows));

    return [
        "../workflows/theWorks.json",
        "../assets/workflows/sdbasic.json"
    ];
    // return userWorkflows.concat(distWorkflows);
}

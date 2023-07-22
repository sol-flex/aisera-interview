const csv = require('csv');
const fs = require('fs');

// Read the input CSV file
const readableStream = fs.createReadStream('sample_dataset_clean.csv');
// Parse the CSV data
const parseStream = csv.parse({ headers: true, trim: true })
// Write the output CSV file
const writableStream = fs.createWriteStream('user_task_report.csv');

let isHeaderRow = true;
let users = {}
/*
* The code below reads the sample data csv, parses it in the parseStream .on("data") and when it is finished
* .on("end") outputs the report into an output csv titled user_task_report.csv
*/

readableStream
  .pipe(parseStream)
  .on("data", (data) => {

    // Skip the header row
    if (isHeaderRow === true) {
      isHeaderRow = false;
      return;
    }
    // Assign to variables for readability
    let timestamp = parseInt(data[0])
    let userID = data[1]
    let taskID = data[2]
    let eventType = data[3]

    /*
    *     The following conditional statements are intended to populate the users object
    *     above according to the following pattern:   
    *      {
    *         userID1: { taskID1: timeElapsed, taskID2: timeElapsed },
    *         userID2: { taskID3: timeElapsed, taskID4: timeElapsed },  
    *      }          
    */   
    if(!(userID in users)) {
        // Create a new user entry if one doesn't exist
        eventType === "Task Started" ? 
            users[userID] = { [taskID]: -timestamp } :
            users[userID] = { [taskID]: timestamp } 
    } else {
        if(taskID in users[userID]) {
            // Update existing task entry for the user if it exists
            eventType === "Task Started" ? 
                users[userID][taskID] -= timestamp :
                users[userID][taskID] += timestamp 
        } else {
            // Create a new task entry for the user if it doesn't exist
            eventType === "Task Started" ? 
                users[userID][taskID] = -timestamp :
                users[userID][taskID] = timestamp
        }
    }


  })
  .on("end", () => {
    // Write the header row to the output CSV file
    writableStream.write("UserID, TaskIDs with elapsed time in seconds" + "\n"); 

    // Write user data to the output CSV file
    for(user in users) {
        // Remove the {} from each end of the row
        let userTasks = JSON.stringify(users[user]).replace(/[{}]/g, '');
        writableStream.write(`${user}, ${userTasks}\n`); 
    }
    // Output the user data to the console
    console.log("Users with elapsed time on tasks")
    console.log("--------------------------------")
    console.log(users);
  })

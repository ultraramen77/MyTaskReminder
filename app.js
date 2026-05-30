const express = require('express');
const app = express();

// 1. MIDDLEWARE: This allows Express to read data from the HTML form
app.use(express.urlencoded({ extended: true }));

// Tells the server to allow access to your public assets folder
app.use(express.static('public'));

// Setting EJS as the view engine
app.set('view engine', 'ejs');   

// The tasks arrays
let tasksList = [];           

// Define a route to render the main page
app.get('/', (req, res) => {
    res.render('tasklog', { tasksList });  //renders the EJS file and passes the array to it to be displayed on web page
});

// 2. POST ROUTE: Handles the form submission  
app.post('/add-item', (req, res) => {           //app.post is to set up a route handler for POST requests to the /add-item URL.
    const newItem = req.body.itemName; // matches the 'name' attribute from HTML field input.
    const priority = req.body.priority; // tells server what priority the new activity belongs to, matching the 'name' attribute in EJS.
    const taskdate = req.body.taskdate; // Captures the date of the new task, matching the 'name' attribute in EJS.

    const taskObject = {        // create an object to store the new task name, date, and priority together, making it easier to manage and display all 3 pieces of information in the EJS template.
        name: newItem,              // Uses key-value pairs to put multiple pieces of data together into 1 object.
        priority: priority,
        date: taskdate
    };

    tasksList.push(taskObject);  // Add the new task to the tasksList array

    // After updating the list, go back to the home page to show the new item
    res.redirect('/');
    }

);

// ROUTE 3: getting the edit page with filled in details of the task to be updated. (Imprtant to capture the category and index of the task to be edited, so that the server can identify which task is being edited and then pass this information down to the edittask.ejs page to fill the form with the current details of the task for editing.)
app.post('/edit-item', (req, res) => {
    const index = req.body.itemIndex;            // const index function is to capture the index of the task to be edited in the array.
    const taskEdit = tasksList[index];          // This is to capture the specific task to be edited from the array using the index captured from the form in tasklog.ejs, so that its details can be passed down to the edit form in edittask.ejs to fill the form with the current details of the task for editing.
    // Render edittask.ejs, passing the task date, and index down to the page which helps to identify the specific task to be edited.
    res.render('edittask', {  index: index, task: taskEdit });  
});

// ROUTE 4: save the updated task.    (This is to help capture the updated details of the task to be edited, and then update the details of that specific task in the correct array based on the index captured from the form in edittask.ejs.)
app.post('/update-item', (req, res) => {             
    const index = req.body.itemIndex; // Locates the targeted array position to update               
    
    // Capture the newly edited data inputs from the edittask.ejs form fields
    const updatedName = req.body.itemName;             
    const updatedPriority = req.body.itemRating; // Captures priority select field (named itemRating in your edit file)
    const updatedDate = req.body.taskdate;         

    // FIXED: Changed taskList to tasksList so it targets the correct master array
    tasksList[index] = { 
        name: updatedName, 
        priority: updatedPriority, 
        date: updatedDate 
    };

    // Go back to the dashboard homepage to display the modified changes instantly
    res.redirect('/');
});

// 5: POST ROUTE: Handles deleting a task using its index       (This part of the code is crucial as it captures the index of the task to be deleted, so that the server can identify which task is being deleted and then remove that specific task from the correct array based on the index captured.)
app.post('/delete-item', (req, res) => {
    const index = parseInt(req.body.itemIndex);  //tells the server where the task is located in that particular array                                                 
                                         // ParseInt is important as data sent from HTML forms is always in string format, and this helps to convert this to integer for accurate indexing in lists.
    tasksList.splice(index, 1);            // splice is crucial: index helps to identify the position of the task in the array, and 1 indicates that only one task should be removed at that index.

    // Go back to the home page to show the updated list
    res.redirect('/');
});

//Define a route to render the about page
app.get('/about', (req, res) => {           //(req, res) => is to set up the route handler for GET requests to the /about URL. When a user navigates to this URL, the server will execute the code inside this function.)
    res.render('about');                   //res.render is used to render the about.ejs file when the user navigates to the /about URL, allowing users to learn more about the app and its purpose.
});

//Define a route to render the add task page
app.get('/addtask', (req, res) => {           //(req, res) => is to set up the route handler for GET requests to the /addtask URL. When a user navigates to this URL, the server will execute the code inside this function.)
    res.render('addtask');                   //res.render is used to render the addtask.ejs file when the user navigates to the /addtask URL, allowing users to add new tasks to their tracker.
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
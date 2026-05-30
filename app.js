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

// ROUTE 3: getting the edit page with filled in details of activity to be updated. (Imprtant to capture the category and index of the activity to be edited, so that the server can identify which activity is being edited and then pass this information down to the editactivity.ejs page to fill the form with the current details of the activity for editing.)
app.post('/edit-item', (req, res) => {
    const category = req.body.category;
    const index = req.body.itemIndex;            // const index function is to capture the index of the activity to be edited in the array.
    // Render edittask.ejs, passing the activity category, and index down to the page which helps to identify the specific activity to be edited.
    res.render('edittask', {  category: category, index: index });
});

// ROUTE 4: save the updated activity.    (This is to help capture the updated details of the activity to be edited, and then update the details of that specific activity in the correct array based on the category and index captured from the form in editactivity.ejs.)
app.post('/update-item', (req, res) => {             //This route (update-item) is to capture the updated details of the activity to be edited, and then update the details of that specific activity in the correct array.
    const category = req.body.category;        //category and index are important to identify the specific activity to be updated in the correct array, and then update the details of that activity in the array with the new details captured from the editing form.
    const index = req.body.itemIndex;                
    
    // Capture the new edits entered by the user in the form
    const updatedName = req.body.itemName;             // These new const functions are to capture the new details of the activity to be updated, and then use these details to replace the old details of the activity in the array.
    const updatedRating = req.body.itemRating;         // req.body.itemName and Rating are to capture the new details entered by the user in the form, matching the 'name' attributes in the editactivity.ejs form.

    // Target the specific array element and replace its property details
    if (category === 'Hobbies') {
        hobbiesList[index] = { name: updatedName, rating: updatedRating };     // This is to replace the old details of the activity with the new details captured from the form, by targeting the specific index of the activity in the array and then updating its name and rating properties with the new details.
    } else if (category === 'Sports') {
        sportsList[index] = { name: updatedName, rating: updatedRating };        //list[index] is to target the specific activity to be updated in the array, and then replace its details with the new details captured from the form in editactivity.ejs.
    } else if (category === 'Videogames') {
        videogamesList[index] = { name: updatedName, rating: updatedRating };
    } else if (category === 'Movies') {
        moviesList[index] = { name: updatedName, rating: updatedRating };
    }

    // Go back to the dashboard to show the changes instantly
    res.redirect('/');
});

// 5: POST ROUTE: Handles deleting an activity using its category and index       (This part of the code is crucial as it captures the category and index of the activity to be deleted, so that the server can identify which activity is being deleted and then remove that specific activity from the correct array based on the category and index captured.)
app.post('/delete-item', (req, res) => {
    const category = req.body.category;   // tells the server which category the activity to be deleted belongs to
    const index = parseInt(req.body.itemIndex);  //tells the server where the activity is located in that particular array
                                                 // itemIndex is to help identify the position of the activity in the array, so it can be removed with splice.
                                                 // ParseInt is important as data sent from HTML forms is always in string format, and this helps to convert this to integer for accurate indexing in lists.
    if (category === 'Hobbies') {
        hobbiesList.splice(index, 1);            // splice is crucial: index helps to identify the position of the activity in the array, and 1 indicates that only one activity should be removed at that index.
    } else if (category === 'Sports') {         //splice then removes that one specific activity in the array, and shifting any activities behind it forward to fill the gap above if there are activities below it.
        sportsList.splice(index, 1);
    } else if (category === 'Videogames') {      
        videogamesList.splice(index, 1);
    } else if (category === 'Movies') {
        moviesList.splice(index, 1);
    }

    // Go back to the home page to show the updated list
    res.redirect('/');
});

//Define a route to render the about page
app.get('/about', (req, res) => {           //(req, res) => is to set up the route handler for GET requests to the /about URL. When a user navigates to this URL, the server will execute the code inside this function.)
    res.render('about');                   //res.render is used to render the about.ejs file when the user navigates to the /about URL, allowing users to learn more about the app and its purpose.
});

//Define a route to render the add activity page
app.get('/addtask', (req, res) => {           //(req, res) => is to set up the route handler for GET requests to the /addactivity URL. When a user navigates to this URL, the server will execute the code inside this function.)
    res.render('addtask');                   //res.render is used to render the addtask.ejs file when the user navigates to the /addactivity URL, allowing users to add new activities to their tracker.
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
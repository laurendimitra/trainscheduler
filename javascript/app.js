// Initialize Firebase
var config = {
    apiKey: "AIzaSyD4v2VvgrLTYZMQ8KXJSzLy2TnPRffajUo",
    authDomain: "trains-4154b.firebaseapp.com",
    databaseURL: "https://trains-4154b.firebaseio.com",
    projectId: "trains-4154b",
    storageBucket: "trains-4154b.appspot.com",
    messagingSenderId: "756439529081"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var firsttime = "";
var frequency = 0;

$(document).ready(function() {
    // form submit handler
    $('body').on('click', '#add-train', function(event) {
        event.preventDefault();
        name = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firsttime = $("#firsttime-input").val().trim();
        frequency = parseInt($("#frequency-input").val().trim());
        // Code for handling the push
        database.ref().push({
            name: name,
            destination: destination,
            firsttime: firsttime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
});


// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function (childSnapshot) {

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firsttime = childSnapshot.val().firsttime;
    var frequency = childSnapshot.val().frequency;

    var timeHour = moment().format('H');
    var timeMin = moment().format('m');
    var ftHour = moment(firsttime, "HH:mm").format('H');
    var ftMin = moment(firsttime, "HH:mm").format('m');

    var ftMoment = (ftHour * 60) + (ftMin * 1);
    var timeMoment = (timeHour * 60) + (timeMin * 1);

// Find how much time has passed since the first train
    var diff = timeMoment - ftMoment;

// Find how many trains have come so far
    var trainsSinceFirst = Math.floor(diff/frequency);

// Find how long until the next train comes
    var nextArrival = (((trainsSinceFirst + 1) * frequency) + ftMoment);
    // var nextArrivalFormat = moment(nextArrival, 'HH:mm');
    
    var minAway = nextArrival - timeMoment;
    



   
    // full list of items to the well
    var varDiv = $('<tr>');
    var td1 = $('<td>' + name + '</td>');
    var td2 = $('<td>' + destination + '</td>');
    var td3 = $('<td>' + frequency + '</td>');
    var td4 = $('<td>' + nextArrival + '</td>');
    var td5 = $('<td>' + minAway + '</td>');

    varDiv.append(td1);
    varDiv.append(td2);
    varDiv.append(td3);
    varDiv.append(td4);
    varDiv.append(td5);

    $(".table").append(varDiv);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

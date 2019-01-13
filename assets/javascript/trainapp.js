$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC2w39xN501CK3COekUshHsmfdIRnvA-6U",
        authDomain: "train-arrival-app-5bed4.firebaseapp.com",
        databaseURL: "https://train-arrival-app-5bed4.firebaseio.com",
        projectId: "train-arrival-app-5bed4",
        storageBucket: "",
        messagingSenderId: "406246236639"
    };
    firebase.initializeApp(config);

    //create database variable
    var database = firebase.database();

    //function to to compute the next train time.
    function nextTrain(time, freq) {
        var timeTillNextTrain = minutesAway(time, freq);
        var nextTrain = moment().add(timeTillNextTrain, "minutes");
        return moment(nextTrain).format("HH:mm");
    }

    //function to compute the number of minutes away the next train is.
    function minutesAway(time, freq) {
        var timeConverted = moment(time, "HH:mm").subtract(1, "years");
        var timeDiff = moment().diff(moment(timeConverted), "minutes");
        var timeRem = timeDiff % freq;
        var minTillNext = freq - timeRem;
        return minTillNext;
    }

    //call to the database to populate the table with current train information
    database.ref().on("child_added", function(childSnapshot) {

        $("#train-information").append("<tr><td class='train-name'>" + childSnapshot.val().trainName + "</td><td class='destination'>" + childSnapshot.val().destination + "</td><td class='frequency'>" + childSnapshot.val().frequency + "</td><td class='next-arrival'>" + nextTrain(childSnapshot.val().firstTrain, childSnapshot.val().frequency) + "</td><td class='minutes-away'>" + minutesAway(childSnapshot.val().firstTrain, childSnapshot.val().frequency) +
            "</td><td class='delete-train'><button class='delete-train-btn btn btn-danger' value='" + childSnapshot.val().trainName + "'>Delete</button></td></tr>");
    })

    //on click event to grab the new train information, store into variables, and push information to the database.
    $("#submit-train").on("click", function(event) {


        var trainName = $("#name-of-train").val().trim();
        var destination = $("#train-destination").val().trim();
        var frequency = parseInt($("#train-frequency").val().trim());
        var firstTrain = $("#first-train-time").val().trim();

        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            firstTrain: firstTrain
        });
    });

    //creating on click event to capture information from the specific train and then to delete it from the database.  (Not currently working)
    $(".delete-train-btn").on("click", function(event) {
        console.log("clicked");
        var toBeRemoved = $(this).val();
        database.ref(toBeRemoved).remove();
    });
})
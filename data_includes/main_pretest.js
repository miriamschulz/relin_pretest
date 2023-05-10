// This script contains the code for the pretest for the picture stumuli to be
// used in experiment C3_WP3_exp3.1a
// Miriam Schulz
// 14-04-2023


PennController.ResetPrefix(null);
// DebugOff()

Sequence("initRecord",
         "instructions",
         "audiotest",
         "sendAsync", // send first recording from the audio test
         "example",
         sepWith("sendAsync",   // upload every trial individually
                 randomize("trials")),
         "syncUpload",  // upload all together OR last trial?
         SendResults(),
         "outro");

//InitiateRecorder( url , message )
// PennController.PreloadZip("https://coli.uni-saarland.de/~mschulz/experiments/relin/pretest_images.zip"); // Pictures
AddHost("https://schulz.coli.uni-saarland.de/experiments/relin_pilot/pretest/images_pretest/"); // Pictures (individual files)
InitiateRecorder("https://schulz.coli.uni-saarland.de/experiments/relin_pilot/pretest/saveRecordings.php",
"Dieses Experiment speichert Tonaufnahmen der Teilnehmer. Ihr Browser sollte Sie nun auffordern, Ihr Aufnahmegerät zu benutzen (falls zutreffend). Durch Ihre Zustimmung zur Aufnahme und durch Ihre Teilnahme an diesem Experiment geben Sie dem/den Entwickler(n) dieses Experiments die Erlaubnis, die während dieses Experiments aufgenommenen Proben anonym zu speichern. Die Aufnahmen werden auf einen von dem/den Versuchsleiter(n) bestimmten Server hochgeladen und dort gespeichert. Wenn Sie der Aufforderung zustimmen, wird während des gesamten Experiments am oberen Rand dieses Fensters eine Markierung sichtbar sein, die anzeigt, ob Sie gerade aufgezeichnet werden.").label("initRecord");
UploadRecordings("sendAsync", "noblock")
UploadRecordings("syncUpload")

CheckPreloaded()
    .label("preloadTrials")

// CHange the label on the progress bar
var progressBarText = "Fortschritt";

// Create a unique ID per participant as a variable (to append to results + recordings)
id = ("0000" + ((Math.random() * Math.pow(36, 8)) | 0).toString(36)).slice(-6);

// Intro screen
PennController("instructions",
    newHtml("instructions", "instructions.html")
        .print()
    ,
    newButton("Fortfahren")
        .center()
        .bold()
        .print()
        .wait()
)
.log("Experiment", "Survey_html")


// Audio test
PennController("audiotest",
    newHtml("audiotest", "audiotest.html")
        .print()
    ,
    newButton("startrecording", "Aufnahme beginnen")
        .center()
        .bold()
        .print()
        .wait()
    ,
    getButton("startrecording")
        .remove()
    ,
    newImage("recordingicon", "recordingicon.png")
        .center()
        .size(50,50)
        .print()
    ,
    newButton("stoprecording", "Aufnahme beenden")
        .center()
        .bold()
        .print()
    ,
    newMediaRecorder("recorder"+"_"+id+"_"+"testrun", "audio")
        .record()
    ,
    getButton("stoprecording")
        .wait()
        .remove()
    ,
    getImage("recordingicon")
        .remove()
    ,
    newTimer("timer1", 300)
        .start()
        .wait()
    ,
    newImage("audioicon", "audioicon.png")
        .center()
        .size(50,50)
        .print()
    ,
    getMediaRecorder("recorder"+"_"+id+"_"+"testrun")
        .stop()
        .disable()
        .play()
        .wait("playback")
    ,
    getImage("audioicon")
        .remove()
    ,
    getMediaRecorder("recorder"+"_"+id+"_"+"testrun")
        .stop()
    ,
    newTimer("timer2", 500)
        .start()
        .wait()
    ,
    newText("Wenn der Audiotest erfolgreich war, klicken Sie nun auf \"Fortfahren\".<br>Andernfalls schließen Sie das Experiment nun und wenden Sie sich an den Versuchsleiter.")
        .cssContainer({"color": "red", "text-align":"center", "padding-top": "10px", "padding-bottom": "10px"})
        .print()
    ,
    newButton("Fortfahren")
        .center()
        .bold()
        .print()
        .wait()
)
.log("Experiment", "Survey_html")


// Transition screen
PennController("transition",
    newHtml("transition", "transition.html")
        .print()
    ,
    newButton("Experiment starten")
        .center()
        .bold()
        .print()
        .wait()
)
.log("Experiment", "Survey_html")


// Example
PennController("example",
    newHtml("example", "example.html")
        .print()
    ,
    newImage("examplepicture", "Telefon_rot.png")
        .center()
        .size(300)
        .print()
    ,
    newButton("Experiment starten")
        .center()
        .bold()
        .print()
        .wait()
)
.log("Experiment", "Survey_html")


// Start experiment timer
PennController("startexperiment",
    newText("Sind Sie bereit? Gleich geht es los!")
        .center()
        .print()
    ,
    newTimer("timer", 3000)
        .start()
        .wait()
)
.log("Experiment", "Survey_html")


// Outro
PennController("outro",
    newHtml("outro", "outro.html")
        .print()
        .wait()
    ,
    newButton().wait()  // wait on this screen forever
)
.log("Experiment", "Survey_html")


// Set default formatting for all Text and Button elements:
Header(
    defaultText
        .cssContainer({"font-size": "16px", "text-align":"center", "padding-top": "16px"})
        .center()
        .print()
    ,
    defaultButton
        .cssContainer({"height": "35px", "padding-top": "20px", "padding-bottom": "20px"})
        .center()
        .bold()
        .print()
)
.log("uniqueID", id)


// Experimental trials
Template("data.csv", row =>
    newTrial("trials",
        defaultImage.size(300) // (300,300)
        ,
        newText("taskDescription", "Benennen Sie den Gegenstand in der Box und seine Farbe.")
        ,
        newText("showNext", "Drücken Sie eine beliebige Taste auf Ihrer Tastatur, um das nächste Bild anzuzeigen.")
        ,
        newKey("proceedKey", "")
            .wait()
        ,
        getText("taskDescription")
            .remove()
        ,
        getText("showNext")
                .remove()
        ,
        // Print image
        newCanvas(300,600)
            .add("center at 50%", "middle at 50%", newImage("image", row.ImageName).center())
            .center()
            .print()
        ,
        newButton("stoprecording", "Fertig")
        ,
        newMediaRecorder("recorder_"+id+"_"+row.ImageName, "audio")
            .record()
        ,
        getButton("stoprecording")
            .wait()
        ,
        getMediaRecorder("recorder_"+id+"_"+row.ImageName)
            .stop()
    )
    .log("ItemNum", row.Item)
    .log("Condition", row.Group)
    .log("ImageName", row.ImageName)
    .log("Object", row.Object)
    .log("Color", row.Color)
)

var MINOR_STEPS = [2,1,2,2,1,2,2];
var MAJOR_STEPS = [2,2,1,2,2,2,1];
var MARKED_FRETS_S = [3,5,7,9,15,17,19,21];
var MARKED_FRETS_D = [12,24];
var NOTES = [
    'a', 'as',
    'b',
    'c', 'cs',
    'd', 'ds',
    'e',
    'f', 'fs',
    'g', 'gs'
];

var stringSteps = [5,5,5,4,5,0];
var numStrings = 6;

var strings = [];
var frets = [];
var fretMarkers = [];
var fretCount, baseNote, tuningType, keyNote, modeSteps;
var fretMarkersDrawn = false;
var neck = document.getElementById("neck");
var form = document.getElementById("toolForm");

function deleteOldDrawing(){
    for (let s = 0; s < strings.length; s++)
        strings[s].remove();
    for (let f = 0; f < frets.length; f++)
        frets[f].remove();
    strings = [];
    frets = [];
}

// toolbar data
function refreshFormVals(){
    neck = document.getElementById("neck");
    fretCount = parseInt(form.fretCount.value) + 1;
    baseNote = form.tuningBaseNote.value;
    tuningType = form.tuningType.value;
    keyNote = form.keyNote.value;
    modeSteps = form.keyMode.value == "major" ? MAJOR_STEPS : MINOR_STEPS;
}

// simple casting function to get numberic symbol for a note
function noteToInt(note){
    for (let n = 0; n < NOTES.length; n++)
        if (NOTES[n] == note)
            return n;
}

function drawFretMarkers(){
    for (let f = 0; f < fretMarkers.length; f++)
        fretMarkers[f].remove();
    fretMarkers = [];

    for (let fretNumber = 0; fretNumber < fretCount; fretNumber++){
        // single fret markers
        if ( MARKED_FRETS_S.includes(fretNumber) ){
            let fMarker = document.createElement("div");
            let leftMarg = fretNumber * parseInt(window.getComputedStyle(neck).width) / fretCount + 1;
            fMarker.setAttribute("class", "fretMarker");
            fMarker.style.left = "calc( 1% + "+leftMarg+"px)";
            fMarker.style.top = "135px";
            fretMarkers.push(fMarker);
            neck.appendChild(fMarker);
        } // dual fret markers
        else if ( MARKED_FRETS_D.includes(fretNumber) ){
            let fMarkerT = document.createElement("div");
            let fMarkerB = document.createElement("div");
            let leftMarg = fretNumber * parseInt(window.getComputedStyle(neck).width) / fretCount + 1;
            fMarkerT.setAttribute("class", "fretMarker");
            fMarkerB.setAttribute("class", "fretMarker");
            fMarkerT.style.left = "calc( 1% + "+leftMarg+"px)";
            fMarkerB.style.left = "calc( 1% + "+leftMarg+"px)";
            fMarkerT.style.top = "85px";
            fMarkerB.style.top = "185px";
            fretMarkers.push(fMarkerT);
            fretMarkers.push(fMarkerB);
            neck.appendChild(fMarkerT);
            neck.appendChild(fMarkerB);
        }
    }
    fretMarkersDrawn = true;
}

// draw in the strings and frets
function draw(){
    deleteOldDrawing();
    refreshFormVals();
    if (tuningType == "drop")
        stringSteps[0] = 7;
    else
        stringSteps[0] = 5;

    var inKeyNOTES = [];
    let lastInKeyNote = noteToInt(keyNote);

    for (let m = 0; m < modeSteps.length; m++){
        inKeyNOTES.push(NOTES[lastInKeyNote % 12]);
        lastInKeyNote += modeSteps[m];
    }
    //console.log(inKeyNOTES);

    let stringNote = noteToInt(baseNote);
    for (let s = 0; s < numStrings; s++){
        let string = document.createElement("div");
        string.setAttribute("class", "string");
        string.style.height = parseInt(window.getComputedStyle(neck).height) / numStrings -1 + "px";
        string.style.top = 1;
        strings.push(string);
        //console.log("pushing '"+NOTES[stringNote % 12]+"' string to the neck");

        // create frets
        let fretNote = stringNote;
        for (let f = s * fretCount; f < (s + 1) * fretCount; f++){
            let fret = document.createElement("div");
            fret.style.width = parseInt(window.getComputedStyle(neck).width) / fretCount-5 + "px";
            fret.setAttribute("class", inKeyNOTES.includes(NOTES[fretNote % 12]) ? "fret inKey" : "fret outKey");

            fret.innerText = NOTES[fretNote % 12].replace("s","#").toUpperCase();
            frets.push(fret);
            string.appendChild(fret);
            fretNote++;
        }
        stringNote += stringSteps[s];
    }
    // push strings to DOM
    for (let s = numStrings - 1; s >= 0; s--)
        neck.appendChild(strings[s]);

    // add frett markers
    drawFretMarkers();
}
draw();

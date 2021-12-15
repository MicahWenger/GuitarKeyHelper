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
var stringNames = ['E','B','G','D','A','E'];
var numStrings = 6;

var strings = [];
var frets = [];
var fretMarkers = [];
var fretCount, baseNote, tuningType, keyNote, modeSteps;
var fretMarkersDrawn = false;
var neck = document.getElementById("neck");
var form = document.getElementById("toolForm");
var inKeyNOTES;

// practice game vars
var time, timer, pString, pNote;

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
    stringSteps[0] = tuningType == "drop" ? 7 : 5;

    inKeyNOTES = [];
    let lastInKeyNote = noteToInt(keyNote);

    for (let m = 0; m < modeSteps.length; m++){
        inKeyNOTES.push(NOTES[lastInKeyNote % 12]);
        lastInKeyNote += modeSteps[m];
    }
    let stringNote = noteToInt(baseNote);
    for (let s = 0; s < numStrings; s++){
        let string = document.createElement("div");
        string.setAttribute("class", "string");
        string.style.height = parseInt(window.getComputedStyle(neck).height) / numStrings -1 + "px";
        string.style.top = 1;
        strings.push(string);

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


// practice functionality
function stopPractice(){
    clearInterval(timer);
    document.getElementById("startButton").style.backgroundColor="limegreen";
    document.getElementById("startButton").innerText="Start";
    document.getElementById("startButton").onclick=startPractice;
    draw();
}
function startPractice(){
    time = document.getElementById("practiceTime").value;
    pNote = NOTES[parseInt(Math.random()*NOTES.length)];
    pString = parseInt(Math.random()*numStrings);
    document.getElementById("pNote").innerText = "Note: "+ pNote.replace("s", "#").toUpperCase();
    document.getElementById("pString").innerText = "String: "+ stringNames[5-pString];
    document.getElementById("startButton").style.backgroundColor="red";
    document.getElementById("startButton").innerText="Stop";
    document.getElementById("startButton").onclick=stopPractice;

    // clear note values
    for (let s in strings){
        let fts = Array.from(strings[s].children);
        for (let f in fts){
            fts[f].innerText = "";
            fts[f].setAttribute("class", s == pString ? "fret inKey" : "fret outKey");
        }
    }
    timer = setInterval(updatePtimer, 1000);
}
function updatePtimer(){
    if (time < 0){
        clearInterval(timer);
        revealAnswer();
    }
    else{
        document.getElementById("pTime").innerText = time + "s";
        time--;
    }
}
function revealAnswer(){
    let fts = Array.from(strings[pString].children);
    let fretNote = noteToInt(stringNames[5-pString].toLowerCase());
    for (let f in fts){
        fts[f].setAttribute("class", NOTES[fretNote % 12] == pNote ? "fret inKey" : "fret outKey");
        fts[f].innerText = NOTES[fretNote % 12].replace("s","#").toUpperCase();
        fretNote++;
    }
    setTimeout(function(){
        startPractice();
    }, 5000);
}


draw();

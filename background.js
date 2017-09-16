
// Icons used in the chrome toolbar

const STATES = {
  IDLE: {
    name: "IDLE",
    icon: "play.png",
    click: startReading
  },
  READING: {
    name: "READING", 
    icon: "stop.png",
    click: stopReading
  }
};

var voices = window.speechSynthesis.getVoices();
var voiceIndex = 3;

var currentState = STATES.IDLE;

function startReading() {

  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    
    var text = selection[0];
    var reader = createReader(text);

    window.speechSynthesis.speak(reader);
  });

  currentState = STATES.READING;
  setIcon(currentState.icon);
}

function stopReading() {

  window.speechSynthesis.cancel();
  currentState = STATES.IDLE;
  setIcon(currentState.icon);
}

function createReader(text) {

  var reader = new SpeechSynthesisUtterance(text);
  
  reader.voice = voices[voiceIndex];
  reader.onend = (ev) => stopReading();
  reader.onerror = (ev) => console.error(ev);

  return reader;
}

function executeScript(script) {  
  chrome.tabs.executeScript(script);
}

function setIcon(icon) {
  var args = { path: icon };
  chrome.browserAction.setIcon(args);
}


// Called when the user clicks on the browser action.
function onClicked(tab) {
  
  currentState.click();
}

// plug it in
chrome.browserAction.onClicked.addListener(onClicked);
setIcon(currentState.icon);

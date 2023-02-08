function toggleBG() {
   var element = document.body;
   element.classList.toggle("light-mode");
}

var inputE=document.getElementById('inputbox');
var outputE=document.getElementById('output');
var scaleselector=document.getElementById('scale');
var colorselector=document.getElementById('outcolor')
var fontselector=document.getElementById('fontfam')


function getString() {
  var href = document.location.href;
  if (/#/.test(href)) {
    var content = /#(.*)$/.exec(href)[1];
    inputE.value = decodeURIComponent(content);    
  }
}

function writeString() {
  stuff=inputE.value
outstring='https://embiggener.bryanmosher1.repl.co/#' + stuff
  document.location.href = outstring.replace(/\n\r?/g, '%0d')
}

function initialize() {
  getString();
  callScale();
  colorChange();
  fontChange();
  updateOutput();
}

function updateOutput() {
  outputE.innerHTML=inputE.value;
}

function colorChange() {
  var newcolor=""
  newcolor=colorselector.value;
  outputE.className='emphasis ' + newcolor;
}

function fontChange() {
  outputE.style.fontFamily=fontselector.value;
}

function callScale() {
  outputE.style.fontSize=scaleselector.value+"em";
}
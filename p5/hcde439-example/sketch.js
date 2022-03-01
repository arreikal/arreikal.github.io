var serial; // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem143201' //rename to the name of your port tty.usbmodem143201
var datain; //some data coming in over serial!
// var xPos = 0; // xPos for graphing
var dataarray = [0,0]; // initialize array for data from arduino
var joyX = 0;           // the x coordinate of joystick
var joyY = 0;           // the y coordinate of joystick
var calcAngle = 0;      // a variable for calculating inverse tan
var angle = 0;          // the angle variable

function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  createCanvas(800, 800);             // make a square canvas
  background(0x100, 0x16, 0x90);      // set the background color

  noCursor();                         // hide the cursor so you can find it
  noStroke();                         // hide strokes
}
 
// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() { //printing status: server connected
  print('connected to server.');
}
 
function portOpen() { //printing status: port opened
  print('the serial port opened.')
}
 
function serialError(err) { //printing status: serial error
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() { //printing status: port closed
  print('The serial port closed.');
}

function serialEvent() {            // function to read serial event
  if (serial.available()) {         // if theres a serial event to read
	var datastring = serial.readLine(); // readin some serial
	var newarray;                     // make a new array
	try {
  	  newarray = JSON.parse(datastring); // can we parse the serial
  	} catch(err) {                  //error
      	  //console.log(err);
	}
	if (typeof(newarray) == 'object') { // if the coordinate was successfully read and turned into an array
  	  dataarray = newarray; // set it as the data
	}
	// console.log("got back " + datastring); //for debugging
  if(newarray != undefined) { // if the coordinate was successfully read and turned into an array
    // console.log("got back " + newarray[0]); //for debugging
    // console.log("got back " + newarray[1]); //for debugging
    joyX=newarray[0]; //update joyX to x coordinate
    joyY=800-newarray[1]; //update joyY to y coordinate (subtract from 800 so its not inversed)
  }
  }
}

function draw() {
  background(0x100, 0x16, 0x90); // set background color
  if(abs(joyX-mouseX)<10 && abs(joyY-mouseY)<10) { // check if joystick and mouse are in the same spot
    background(0x16, 0x16, 0x16); // change background color to signal you win!
  }
  // ellipse(mouseX, mouseY, 33, 33); // for debugging

  ellipse(joyX, joyY, 50, 50); // make circle to be where the joystick is
  var directiontomouse; // make a variable for the angle to the mouse
  directiontomouse = getAngle(); // call angle finder
  console.log("dirction to mouse= " + directiontomouse); // output angle to console (for debugging)
  serial.write(directiontomouse); // send the direction from joystick to the mouse back to the arduino
}

function getAngle() { // find the angle from joystick to the mouse
  var difX; // make a new var for x difference
  var difY; // make a new var for y difference
  difX = joyX-mouseX; // find dif
  difY = joyY-mouseY; // find dif
  // console.log("difX= " + difX + "   difY= " + difY); // for debugging
  calcAngle=atan(difY/difX)*180.0/3.14; //calculate the angle
  // console.log("angle= " + calcAngle); // for debugging

  // mapping inverse tan to the actual angle i'm looking for 
  if((mouseX > joyX)&&(mouseY == joyY)) { // mouse is directly right of joystick
      angle=0;
  }
  else if ((mouseX < joyX)&&(mouseY == joyY)) { // mouse is directly left of joystick
    angle=180;
  }
  else if((mouseX == joyX)&&(mouseY > joyY)) { // mouse is directly below joystick
    //OTHER LIGHT SHOULD TURN ON
    angle=270;
}
  else if ((mouseX == joyX)&&(mouseY < joyY)) { // mouse is directly above of joystick
    angle=90;
  }
  else if ((mouseX > joyX)&&(mouseY < joyY)) // Quadrant 1 
  {
    angle=abs(calcAngle);
  }
  else if ((mouseX > joyX)&&(mouseY > joyY)) // Quadrant 4 
  {
    angle=360-calcAngle;
  }
  else if ((mouseX < joyX)&&(mouseY > joyY)) // Quadrant 3
  {
    angle=180+abs(calcAngle);
  }
  else if ((mouseX < joyX)&&(mouseY < joyY)) // Quadrant 2
  {
    angle=180-calcAngle;
  }
  return angle; // return new angle
}

function wait(time) // a waiting function from https://stackoverflow.com/questions/67221313/how-to-wait-in-p5-js
{ // this wasnt actually used
  start = millis()
  do
  {
    current = millis();
  }
  while(current < start + time)
}


// function graphData(newData) {
//   // map the range of the input to the window height:
//   var yPos = map(newData, 0, 255, 0, height);
//   // draw the line in a pretty color:
//   stroke(255, 0, 80);
//   line(xPos, height, xPos, height - yPos);
//   // at the edge of the screen, go back to the beginning:
//   if (xPos >= width) {
//     xPos = 0;
//     // clear the screen by resetting the background:
//     background(0x08, 0x16, 0x40);
//   } else {
//     // increment the horizontal position for the next reading:
//     xPos++;
//   }
// }

// function draw() {
//   background(0);
//   fill(255);

//   if (datain == 0) {
//       text("button pressed: NO", 30,30);
//   } else {
//       text("button pressed: YES", 30,30);
//   }
// }







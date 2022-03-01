
#include <Servo.h> //Servo Library
Servo myServo; // create a servo object

int VRx = A1; // x value pin
int VRy = A0; // y value in
int SW = 2;  // button press pin

int xPosition = 0;
int yPosition = 0;
int SW_state = 0;
int mapX = 0;
int mapY = 0;

int angle = 0;
int newAngle = 0;
 
void setup() {
  Serial.begin(9600); // start serial 
  
  pinMode(VRx, INPUT); // initialize pin for x
  pinMode(VRy, INPUT); // initialize pin for y
  pinMode(SW, INPUT_PULLUP);  // initialize buttin press pin
  myServo.attach(11); // attach pin 11 to the servo object
  Serial.setTimeout(10); // set the timeout for parseInt
  pinMode(9, OUTPUT); // initialize LED pin
  pinMode(8, OUTPUT); // initialize LED pin, this was for debugging when I was switching things around
  pinMode(7, OUTPUT); // initialize LED pin
}

void loop() {
  if (Serial.available() > 0) {   // if there's serial data 
   int inByte = Serial.read(); // read it
//  Serial.write(inByte);   // send it back out as raw binary data
  newAngle = inByte;      // set the new angle as what was sent from p5
 }

  xPosition = analogRead(VRx); // find x position of joystick
  yPosition = analogRead(VRy); // find y position of joystick
  SW_state = digitalRead(SW); // read button press
  mapX = map(xPosition, 0, 1023, 0, 800);  // map x-value to canvas size
  mapY = map(yPosition, 0, 1023, 0, 800);  // map y-value to canvas size


  // serial print the coordinate to p5
  Serial.print("[");
  Serial.print(mapX);
  Serial.print(",");
  Serial.print(mapY);
  Serial.println("]");


  if (newAngle<180) { // red pointer would correspond to this
    digitalWrite(7, HIGH);  // turn on the red light
    digitalWrite(9, LOW);   // turn off the yellow light
    angle = newAngle;       // set the angle to the input angle
  } else {          // yellow pointer would correspond to this (opposite angle)
    digitalWrite(9, HIGH);  // turn on the yellow light
    digitalWrite(7, LOW);   // turn off the red light
    angle= newAngle-180;    // set the angle to accross the input angle (the opposite angle)
    }
  myServo.write(angle);     // write the correct anglee to the servo
  }

//
//int pX = 0; 
//int pY = 0;

//  delay(100);

//  float angle = 0;
//  int Dangle = 0;
//  angle = tan((mapY-pY)/(mapX-pX));
//  Dangle= degrees(angle);
  
//Serial.println(angle);
//Serial.println(Dangle);

//myServo.write(Dangle);
//  delay(100);
  
  


/* 
 * 
 * 
 * 
 */

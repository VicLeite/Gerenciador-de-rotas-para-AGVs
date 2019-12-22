#include <main.h>

void setup() {
  Serial.begin(9600);
  pinoutInit();
  wifiInit();
  connectServerTCP();
  rfidInit();
  initStateMachine();
}

void loop(){
  machine.runMachine();
  client_available();
}
#include <Arduino.h>
#include <SPI.h>                                                              
#include <MFRC522.h>
#include <HCSR04.h>
#include <WiFi.h>
#include <Ticker.h>
#include "pinout.h"

// const char *ssid = "Interage";
// const char *password = "24589001";

const char *ssid = "Victoria";
const char *password = "victoria123";

const IPAddress server(192,168,43,54);
const int httpPort = 6969;

#define AGV_NAME            0x00

/* Declaração do status do AGV */
#define S_WAITING           0xA0
#define S_LINE              0xA1
#define S_FORK_LEFT         0xA2
#define S_FORK_RIGHT        0xA3 
#define S_SLEEP             0xA4
#define S_REQUESTING        0xA5
#define S_ERROR             0xE0
#define S_OUTLINE           0xE1           
#define S_STOPPED           0xE2

/* Declaração das vias do mapa */
#define E1                  0x00
#define E2                  0x01
#define E3                  0x02
#define E4                  0x03
#define E5                  0x04
#define A1                  0x05
#define A2                  0x06
#define U1                  0x07
#define U2                  0x08
#define U3                  0x09
#define U4                  0x0A
#define U5                  0x0B
#define SS                  0x0C //no via

/* Tipos de Respose */
#define TCP_UP              0xB0
#define TCP_SLEEP           0xB1
#define TCP_WAKE            0xB2

/* Declaração de varaievais*/
int LFSensor[5] = {0, 0, 0, 0, 0};
int status = S_WAITING;
float distance = 0;
bool hasComand = false;
int response = TCP_SLEEP;
bool newResponse = false;
int localizacao = AGV_NAME; 
int bifurca = SS;
int reto = SS;
bool flagBifurca = false;
int tagAtual = 0;
int locNext = SS;
bool motion = false; //false = reto e true = bifurcar.

int trajectory[19] = {20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20};
int trajectorySize = 0;
int trajectoryStep = 0;

bool endTrajectory = false;
int res = 0;


/* Declaração de informações de cada TAG */
int tag[12][3] = {
    {E1, SS, E4}, //1
    {E2, SS, E4}, //2
    {E3, SS, E4}, //3
    {E4, A1, U1}, //4
    {A1, SS, U1}, //5
    {U1, U3, U2}, //6
    {U2, SS, U4}, //7
    {U3, SS, U4}, //8
    {U4, A2, U5}, //9
    {A2, SS, U5}, //10
    {U5, E5, E1}, //11
    {E5, E2, E3} //12
};

/* Declaração de objetos */
MFRC522 mfrc522(SS_PIN, RST_PIN);
UltraSonicDistanceSensor distanceSensor(TRIGGER , ECHO); 
WiFiClient client;
Ticker flipper;

//#include "followLine.h"
#include "web.h"
#include "rfid.h"
#include "ultrassom.h"

#include "followLine.h"
#include "tcp.h"
#include "stateMachine.h"


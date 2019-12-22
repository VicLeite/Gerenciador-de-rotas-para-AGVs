#define MOTOR_IN1           15
#define MOTOR_IN3           2
#define lineFollowSensor0   13
#define lineFollowSensor1   12
#define lineFollowSensor2   14
#define lineFollowSensor3   27
#define lineFollowSensor4   26
#define SS_PIN              5   
#define RST_PIN             21 
#define TRIGGER             0
#define ECHO                4

// setting PWM properties
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 10;
const int IN1 = 15;
const int IN3 = 2;

void pinoutInit(){
  pinMode(lineFollowSensor0, INPUT);
  pinMode(lineFollowSensor1, INPUT);
  pinMode(lineFollowSensor2, INPUT);
  pinMode(lineFollowSensor3, INPUT);
  pinMode(lineFollowSensor4, INPUT);

  ledcSetup(MOTOR_IN3, freq, resolution);
  ledcSetup(MOTOR_IN1, freq, resolution);
  ledcAttachPin(IN1, MOTOR_IN1 );
  ledcAttachPin(IN3, MOTOR_IN3);
  
  ledcWrite(MOTOR_IN3, 0);
  ledcWrite(MOTOR_IN1, 0);
}
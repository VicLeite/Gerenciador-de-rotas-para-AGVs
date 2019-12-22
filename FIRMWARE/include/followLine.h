void runMotors(int control)
{ 
  int leftMotorSpeed = 920 + control;
  int rightMotorSpeed = 920 - control;

  if(leftMotorSpeed > 1020) leftMotorSpeed = 1020;
  
  if(rightMotorSpeed > 1020) rightMotorSpeed = 1020;
  
  if(leftMotorSpeed < 820)  leftMotorSpeed = 0;

  if(rightMotorSpeed < 820) rightMotorSpeed = 0;

  ledcWrite(MOTOR_IN1 ,leftMotorSpeed);
  ledcWrite(MOTOR_IN3 ,rightMotorSpeed);
}

void stopMotors(){
  ledcWrite(MOTOR_IN1 ,0);
  ledcWrite(MOTOR_IN3 ,0);
}

void frontMotors(){
  ledcWrite(MOTOR_IN1 ,850);
  ledcWrite(MOTOR_IN3 ,850);
}

void turnMotor(bool sentido){
  if(sentido){  // left
    ledcWrite(MOTOR_IN1 ,860);
    ledcWrite(MOTOR_IN3 ,0);
  }else{ // right
    ledcWrite(MOTOR_IN1 ,0);
    ledcWrite(MOTOR_IN3 ,860);
    
  }
}

void turnMotor1(bool sentido){
  if(sentido){  // left
    ledcWrite(MOTOR_IN1 ,860);
    ledcWrite(MOTOR_IN3 ,0);
  }else{ // right
    ledcWrite(MOTOR_IN1 ,0);
    ledcWrite(MOTOR_IN3 ,860);
  }
}

void readSensors()
{
  LFSensor[0] = digitalRead(lineFollowSensor0);
  LFSensor[1] = digitalRead(lineFollowSensor1);
  LFSensor[2] = digitalRead(lineFollowSensor2);
  LFSensor[3] = digitalRead(lineFollowSensor3);
  LFSensor[4] = digitalRead(lineFollowSensor4);
}

int safeLine(){
  if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 1))      // NO_LINE;
    return 0; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 0) && (LFSensor[2] == 0) && (LFSensor[3] == 0) && (LFSensor[4] == 0)) // NO_LINE;
    return 0; 
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 0) && (LFSensor[3] == 1) && (LFSensor[4] == 0)) 
    return 2; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 1) && (LFSensor[2] == 0) && (LFSensor[3] == 1) && (LFSensor[4] == 1)) 
    return 3;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 0) && (LFSensor[3] == 0) && (LFSensor[4] == 0)) 
    return 2; 
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 0) && (LFSensor[3] == 0) && (LFSensor[4] == 0)) 
    return 2; 
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 0)) 
    return 2; 
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 0)) 
    return 2; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 0) && (LFSensor[2] == 0) && (LFSensor[3] == 1) && (LFSensor[4] == 1)) 
    return 3; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 0) && (LFSensor[2] == 0) && (LFSensor[3] == 0) && (LFSensor[4] == 1)) 
    return 3; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 1)) 
    return 3; 
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 1)) 
    return 3; 
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 1)) 
    return 4; 
  else 
    return 1;
}

int interpreterSensors() {
  if (     (LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 0))
    return 150;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 0))
    return 100;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 0) && (LFSensor[4] == 1))
    return 60;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 0) && (LFSensor[3] == 0) && (LFSensor[4] == 1))
    return 30;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 1) && (LFSensor[2] == 0) && (LFSensor[3] == 1) && (LFSensor[4] == 1))
    return 0;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 0) && (LFSensor[3] == 1) && (LFSensor[4] == 1))
    return -30;
  else if ((LFSensor[0] == 1) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 1))
    return -60;
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 0) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 1))
    return -100;
  else if ((LFSensor[0] == 0) && (LFSensor[1] == 1) && (LFSensor[2] == 1) && (LFSensor[3] == 1) && (LFSensor[4] == 1))
    return -150;
  else 
    return 0;
}

void testLineFollowSensors()
{
  int LFS0 = digitalRead(lineFollowSensor0);
  int LFS1 = digitalRead(lineFollowSensor1);
  int LFS2 = digitalRead(lineFollowSensor2);
  int LFS3 = digitalRead(lineFollowSensor3);
  int LFS4 = digitalRead(lineFollowSensor4);

  Serial.print("LFS: L  0 1 2 3 4  R ==> ");
  Serial.print(LFS0);
  Serial.print(" ");
  Serial.print(LFS1);
  Serial.print(" ");
  Serial.print(LFS2);
  Serial.print(" ");
  Serial.print(LFS3);
  Serial.print(" ");
  Serial.println(LFS4);
  Serial.print(" ");
}
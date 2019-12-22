#include "MACHINE.h"

TSTATE  WAITING, LINE, OUTLINE, SLEEP, FORK_LEFT, FORK_RIGHT, STOPPED, REQUESTING, ERROR;
TMACHINE machine;

/* ESTADO: WAITING 
 * Descrição: Esperando por um comando do servidor.
 * Funções: Deixa o carro parado;
 *          Verifica se tem mensagens do servidor.
 */
void fWAITING(){
  if (machine.firstEntry()) {
    Serial.println("WAITING");
    status = S_WAITING;
    stopMotors();
    trajectoryStep = 0;
    endTrajectory = false;
    tagAtual = 20;
    localizacao = AGV_NAME;
  }

  if(hasComand) machine.changeState(&LINE);
}

/* ESTADO: LINE 
 * Descrição: Segue linha.
 * Funçôes: Ler os sensores de linha;
 *          Interpreta a leitura dos sensore;
 *          Identifica bifurcações;
 */
void fLINE(){
  if (machine.firstEntry()) {
    Serial.println("LINE");
    status = S_LINE;
    hasComand = false;
    statusResponse();
  }

  res = rfidloop();

  if (res) {
    if (res != tagAtual) {
      tagAtual = res;
      res = res - 1;
      localizacao = tag[res][0];
      bifurca = tag[res][1];
      reto = tag[res][2];
      Serial.print("localização: ");
      Serial.println(localizacao);
      Serial.print("bifurcar: ");
      Serial.println(bifurca);
      Serial.print("reto: ");
      Serial.println(reto);
      Serial.print("Trajetoria: ");
      Serial.println(trajectory[trajectoryStep]);

      if(endTrajectory == true && res == AGV_NAME){
        endTrajectory = false;
        stopMotors();
        machine.changeState(&WAITING);
        return;
      }

      if (localizacao != trajectory[trajectoryStep]) {
        Serial.println("Erro de trajetoria!");
        machine.changeState(&ERROR);
        return;
      }
      if (bifurca == trajectory[trajectoryStep + 1]) {
        locNext = bifurca;
        motion = true;
        machine.changeState(&REQUESTING);
      }
      if (reto == trajectory[trajectoryStep + 1]) {
        locNext = reto;
        motion = false;
        machine.changeState(&REQUESTING);
      }
    }
  }

  if((trajectoryStep == (trajectorySize - 1)) && (localizacao == trajectory[trajectorySize - 1])){
    endTrajectory = true;
  } 

  if (!readDistance()) {
    machine.changeState(&STOPPED);
  } else {
    readSensors();

    switch (safeLine())
    {
    case 0:
      machine.changeState(&OUTLINE);
      break;

    case 1:
      runMotors(interpreterSensors());
      break;

    case 2:
      if(flagBifurca){
        if(localizacao == E5){
          machine.changeState(&FORK_RIGHT);
        }else{
          machine.changeState(&FORK_LEFT);
        }
      }

      break;
    
    case 3:
      if(flagBifurca) machine.changeState(&FORK_RIGHT);

      break;

    case 4:
      if(flagBifurca) machine.changeState(&FORK_RIGHT);

      break;

    default:
      break;
    }
  }
}

/* ESTADO: OUTLINE 
 * Descrição: Espera até achar linha novamente.
 * Funçôes: Ler os sensores de linha;
 *          Identifica se há linha;
 */
void fOUTLINE(){
  if (machine.firstEntry()) {
    Serial.println("OUTLINE");
    status = S_OUTLINE;
  }
  readSensors();
  
  if(safeLine() == 1) machine.changeState(&LINE);
}

/* ESTADO: FORK_LEFT
 * Descrição: Movimenta o carro para seguir uma linha adjacente na esquerda.
 * Funçôes: Gira o carro.
 *          Ler o sensores de linha;
 *          Identifica quando sair de uma bifurcação.
 */
void fFORK_LEFT(){
  if (machine.firstEntry()) {
    Serial.println("FORK_LETF");
    status = S_FORK_LEFT;
    flagBifurca = false;
    
    trajectoryStep ++;
    stopMotors();
    delay(1000);
    if(localizacao == E5) 
      turnMotor1(1);
    else 
      turnMotor(1);
    delay(300);
    localizacao = bifurca;
  }
  readSensors();
  if(safeLine() == 1) machine.changeState(&LINE);
}

/* ESTADO: FORK_RIGHT
 * Descrição: Movimenta o carro para seguir uma linha adjacente na direita.
 * Funçôes: Gira o carro.
 *          Ler o sensores de linha;
 *          Identifica quando sair de uma bifurcação.
 */
void fFORK_RIGHT(){
  if (machine.firstEntry()) {
    Serial.println("FORK_RIGHT");
    status = S_FORK_RIGHT;
    flagBifurca = false;
    trajectoryStep ++;
    stopMotors();
    delay(1000);
    if(localizacao == E5) 
      turnMotor1(0);
    else 
      turnMotor(0);
    delay(300);
    localizacao = bifurca;
  }
  readSensors();
  if(safeLine() == 1) machine.changeState(&LINE);
}

/* ESTADO: STOPPED
 * Descrição: Espera até o caminho não está mais obstruido
 * Funçôes: Para o carro.
 *          Ler o sensor de distância;
 */
void fSTOPPED(){
  if (machine.firstEntry()) {
    Serial.println("STOPPED");
    status = S_STOPPED;
    stopMotors();
  }

  if (readDistance()) machine.changeState(&LINE);
}

/* ESTADO: SLEEP
 * Descrição: Espera até o servidor enviar comando de UP.
 * Funçôes: Parar o carro.
 */
void fSLEEP(){
  if (machine.firstEntry()) {
    Serial.println("SLEEP");
    status = S_SLEEP;
    stopMotors();
  }

  if (newResponse) {
    newResponse = false;
    if (response == TCP_WAKE){
      if(motion) {
        Serial.println("Bifurcar!");
        flagBifurca = true;
      }else {
        Serial.println("Continuar reto");
        localizacao = reto;
        trajectoryStep++;
      }
      machine.changeState(&LINE);
    } 
  }
}

/* ESTADO: REQUESTING
 * Descrição: Faz um request para o servidor e espera a resposta.
 * Funçôes: Para o carro;
 *          Faz um request para o servido;
 *          Espera pela resposta.
 */
void fREQUESTING(){
  if (machine.firstEntry()) {
    Serial.println("REQUESTING");
    status = S_REQUESTING;
    stopMotors();
    request(localizacao,locNext);
  }

  if (newResponse) {
    newResponse = false;
    if (response == TCP_UP){
      if(motion) {
        Serial.println("Bifurcar!");
        flagBifurca = true;
      }else {
        Serial.println("Continuar reto");
        localizacao = reto;
        trajectoryStep++;
      }
      machine.changeState(&LINE);
    } else if (response == TCP_SLEEP) {
      machine.changeState(&SLEEP);
    }
  }
}

void fERROR(){
  if (machine.firstEntry()) {
    Serial.println("ERROR");
    status = S_ERROR;
    stopMotors();
  }
  delay(5000);
  localizacao = AGV_NAME; 
  machine.changeState(&WAITING);
}

void initStateMachine(){
  machine.create(&WAITING, fWAITING);
  machine.create(&LINE, fLINE);
  machine.create(&OUTLINE, fOUTLINE);
  machine.create(&SLEEP, fSLEEP);
  machine.create(&FORK_RIGHT, fFORK_RIGHT);
  machine.create(&FORK_LEFT, fFORK_LEFT);
  machine.create(&STOPPED, fSTOPPED);
  machine.create(&REQUESTING, fREQUESTING);
  machine.create(&ERROR, fERROR);
  machine.initMachine(&WAITING);
}
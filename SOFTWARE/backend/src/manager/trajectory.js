const Posto = require('../models/Posto');
const agv = require('../models/agv');
const queueTCP = require('../Queue/queueTCP');
const queueWaiters = require('../Queue/queueWaiters');
const queueService = require('../Queue/queueService');

/* Comandos do protocolo */
const CMD_service = 0x01;
const CMD_config = 0x02;
const CMD_response = 0x03;
const CMD_status = 0x04;
const CMD_AGV_request = 0x05;
const CMD_AGV_status = 0x06;
const CMD_END = 0xEE;

/* STATUS */
const waitingCMD = 0xA0;
const inTrajetory = 0xA1;
const errorTrajetory = 0xE0;
const errorNoLine = 0xE1;

/* Tipos de Respose */
const UP = 0xB0;
const SLEEP = 0xB1;
const WAKE = 0xB2;

/* Vias */
/*  Mapa => E1 = 0, E2 = 2, E3 = 2, A1 = 3, A2 = 4, B1 = 5 ,U1 = 7, U2 = 8, U3 = 9, U4 = 10, U5 = 11 */
const E1 = 0;
const E2 = 1;
const E3 = 2;
const E4 = 3;
const E5 = 4;
const A1 = 5;
const A2 = 6;
const U1 = 7;
const U2 = 8;
const U3 = 9;
const U4 = 10;
const U5 = 11;


/* Couter tem 12 posições referente a cada via
 * Se estiver ocupada, irá ter 0.
 * Se estive vazia, irá ter 1.
 */
let counter = [1,1,1,1,1,1,1,1,1,1,1,1];

/* localizaçãoAGV contem a localização de cada agv */
let localizacaoAGV = [0,1,2];

/* useAGV indica se um AGV está sendo usado ou não.
 * Se um AGV estiver sendo usado é atualizado para true.
 * Caso contrario é atualizado para false.
 */
let useAGV = [true, true, true];

/* Procedimento de prioridade e deadlock */
function priority(agv, atual, next, waiters, size){
  let response;
  let responseFlag = true;

  if (next == U1) {
    switch (atual) {
      case A1:
        response = waiters ? WAKE : UP;
        break;

      case E4:
        if (counter[A1] == 1) {
          response = waiters ? WAKE : UP;
        } else {
          response = SLEEP;
          responseFlag = waiters ? false : true;
        }
        break;

      default:
        responseFlag = false;
        break;
    }
  } else if (next == U4) {

    switch (atual) {
      case U3:
        response = waiters ? WAKE : UP;
        break;

      case U2:
        if (counter[U3] == 1) {
          response = waiters ? WAKE : UP;
        } else {
          response = SLEEP;
          responseFlag = waiters ? false : true;
        }
        break;

      default:
        responseFlag = false;
        break;
    }

  } else {
    response = waiters ? WAKE : UP;
  }

  if(responseFlag){
    Buffer.alloc(4);
    Buffer.allocUnsafe(4);
    queueTCP.enqueue(Buffer.from([CMD_response, agv, response, CMD_END]));

    if(response == WAKE ){
      if(size) counter[localizacaoAGV[agv]] = next;
    }

    if(response == SLEEP){
      Buffer.alloc(3);
      Buffer.allocUnsafe(3);
      queueWaiters.enqueue(Buffer.from([agv, atual, next]));
    }
    return true;
  }else{
    return false;
  }
}

module.exports = {

  async manager(agv, atual, next) {
    let response;
    if (counter[next] == 1) {
      if (priority(agv, atual, next, false, false)) {
        console.log("deu certo..");
      }else{
        console.log("Não deu certo..");
      }
    } else {
      response = SLEEP;
      Buffer.alloc(3);
      Buffer.allocUnsafe(3);
      queueWaiters.enqueue(Buffer.from([agv, atual, next]));

      Buffer.alloc(4);
      Buffer.allocUnsafe(4);
      queueTCP.enqueue(Buffer.from([CMD_response, agv, response, CMD_END]));
    }
  },

  async waiters() {
    if(!queueWaiters.isEmpty()) {
      if(queueWaiters.size() > 1){

      }

      let buf = queueWaiters.peek();
      let agv = buf[0];
      let atual = buf[1];
      let next = buf[2];
      if(counter[next] == 1){
        if (priority(agv,atual,next, true, true)){
          queueWaiters.dequeue();
        }
      }
    }
  },

  async allocService(){
    let posto;
    let agv, trajectory, type;
    if (useAGV[0] == false || useAGV[1] == false || useAGV[2] == false) {
      if (!queueService.isEmpty()) {
        posto = queueService.peek();
        queueService.dequeue();

        const PostoToGo = await Posto.findOne({ name: posto });

        trajectory = (PostoToGo.trajetoria).split(",").map(Number);
        type = PostoToGo.type;

        if (type == 'Carga') {
          type = 0x00;
        } else {
          type = 0x01;
        }

        while (true) {
          let number = Math.floor(Math.random() * 3);
          if (useAGV[number] == false) {
            agv = number; // Achar o agv correto
            useAGV[agv] = true;
            break;
          }
        }

        var buf = Buffer.alloc(4 + trajectory.length);
        buf[0] = CMD_service;
        buf[1] = agv;

        for (let i = 0; i < trajectory.length; i++) {
          buf[i + 2] = trajectory[i];
        }
        buf[2 + trajectory.length] = type;
        buf[3 + trajectory.length] = CMD_END;

        queueTCP.enqueue(buf);
      }
    }
  },

  async updateAGV(agv, atual, status){
    localizacaoAGV[agv] = atual;

    if(status == waitingCMD){
      useAGV[agv] = false;
    }

    counter = [1,1,1,1,1,1,1,1,1,1,1,1];
    counter[localizacaoAGV[0]] = 0;
    counter[localizacaoAGV[1]] = 0;
    counter[localizacaoAGV[2]] = 0;
    console.log(counter);

  }
};

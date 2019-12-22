const net = require('net');
const trajetctory = require('../manager/trajectory');
const queueTCP = require('../Queue/queueTCP');
const queueStatus = require('../Queue/queueStatus');

/* Comandos do protocolo */
const CMD_service = 0x01;
const CMD_config = 0x02;
const CMD_response = 0x03;
const CMD_status = 0x04;
const CMD_AGV_request = 0x05;
const CMD_AGV_status = 0x06;
const CMD_END = 0xEE;

let clients = [];
let last_status = ['agv1','agv2','agv3'];

const tcp = net.createServer((sock) => {
  sock.name = sock.remoteAddress + ":" + sock.remotePort;
  clients.push(sock);

  //tem comando?se sim eniva, se não, não envia
  setInterval( () => {
    if (!queueTCP.isEmpty()){
      broadcast(queueTCP.peek());
      queueTCP.dequeue();
    }
  },4000);

  sock.on('data', (data) => {
    console.log(`DATA from ${sock.remoteAddress}`);
    console.log(data);
    checkData(data);
  });

  sock.on('close', (data) => {
    clients.splice(clients.indexOf(sock), 1);
    broadcast(sock.name + " left the chat.\n");
  });

  sock.on('end', function () {
    clients.splice(clients.indexOf(sock), 1);
    broadcast(sock.name + " left the chat.\n");
  });

  sock.on('error', (error) =>{
    console.log(`Error: ${error}`);
  });

  function broadcast(message) {
    clients.forEach(function (client) {
      client.write(message);
    });
  }

}).listen(process.env.PORT_TCP, process.env.HOST_TCP, () => console.log(`Listening TCP on PORT ${process.env.PORT_TCP}`));




function checkData(CMD) {
  if(CMD.length == 5){
    checkData_(CMD);
  }else{
    if((CMD.length % 5) == 0){
      console.log('Veio junto...');
      let cont;
      cont = CMD.length/5;
      let CMD_= [0,0,0,0,0];
      let i;
      let j;
      for(i=0; i< cont; i++){
        for(j=0;j<5;j++){
          CMD_[j] = CMD[(i*5) + j];
        }
        checkData_(CMD_);
      }
    }else{
      console.log('Dado TCP tamanho errado!!');
    }
  }
}

function checkData_(CMD){
  if(CMD[4] == CMD_END){
    decode(CMD);
  }else{
    console.log('Dado TCP chegou errado!!!');
  }
}

function decode(CMD){
  switch(CMD[0]){
    case CMD_AGV_request:
      trajetctory.manager(CMD[1], CMD[2], CMD[3]);
      trajetctory.updateAGV(CMD[1], CMD[2], 0);
      break;

    case CMD_AGV_status:
      trajetctory.updateAGV(CMD[1], CMD[2],CMD[3]);
      if(last_status[CMD[1]] != CMD[3]) {
        queueStatus.enqueue([CMD[1],CMD[2],CMD[3]]);
        last_status[CMD[1]] = CMD[3];
      }
      break;
  }
}

//Pedindo Status de todos os AGV's
setInterval(() => {
  if(queueTCP.size() <= 2){
    Buffer.alloc(3);
    Buffer.allocUnsafe(3);
    queueTCP.enqueue(Buffer.from([CMD_status, 0x03, CMD_END]));
  }
}, 10000);

module.exports = tcp;

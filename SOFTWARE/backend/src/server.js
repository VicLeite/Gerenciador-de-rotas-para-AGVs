const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');
const tcp = require('./communications/tcp');
const queueTrajectory = require('./Queue/queueWaiters');
const queueStatus = require('./Queue/queueStatus');
const trajetctory = require('./manager/trajectory');

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('status', (message) => {
    console.log(`status: ${message}`);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(routes);

server.listen(process.env.PORT, () => console.log(`Listening on PORT ${process.env.PORT}`));

/* Envia o status para o frontend por socket io a cada 5 segundos */
setInterval(() => {
  let status;
  let status_cmd;
  while(!queueStatus.isEmpty()) {
    status_cmd = queueStatus.peek();
    status = `[AGV ${status_cmd[0] + 1}]: `;
    switch (status_cmd[2]) {
      case 0xA0:
        status += 'Esperando Comando';
        break;
      case 0xA1:
        status += 'À caminho';
        break;
      case 0xA2:
        status += 'À caminho';
        break;
      case 0xA3:
        status += 'À caminho';
        break;
      case 0xA4:
        status += 'Dormindo';
        break;
      case 0xA5:
        status += 'Esperando resposta do gerenciador';
        break;
      case 0xE0:
        status += 'Erro de trajétoria';
        break;
      case 0xE1:
        status += 'Erro: Fora de linha';
        break;
      case 0xE2:
        status += 'Erro: Caminho obstruido';
        break;
      default:
        status += '---'
        break;
    }

    io.emit('/status', status);
    queueStatus.dequeue();
  }
},5000);

/* Verificar se tem algum AGV na lista de espera.
 * Verifica se a trajetória já está disponivel.
 * verifica se tem solicitacao de servico.
 * Verifica em um intervalo de 1s.
 */
setInterval(() => {
  trajetctory.allocService();
  trajetctory.waiters();
},1000);


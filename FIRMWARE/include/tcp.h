/* Comandos do protocolo */
#define CMD_MAN_service     0x01
#define CMD_MAN_config      0x02
#define CMD_MAN_response    0x03
#define CMD_MAN_status      0x04
#define CMD_request         0x05
#define CMD_status          0x06
#define CMD_END             0xEE

void connectServerTCP() {
    Serial.printf("\n[Connecting ...");
    if (client.connect(server, httpPort, 3000)){
        Serial.println("connected]");
    } else {
        Serial.println("connection failed!]");
        client.stop();
    }
}

void request( int atual, int next) {
  if (client.connected()){
    uint8_t buffer[5];
    buffer[0] = CMD_request;
    buffer[1] = AGV_NAME;
    buffer[2] = atual;
    buffer[3] = next;
    buffer[4] = 0xEE;
    client.write(buffer, 5);
  }
}

void statusResponse(){
    if (client.connected()){
        uint8_t buffer[5];
        buffer[0] = CMD_status;
        buffer[1] = AGV_NAME;
        buffer[2] = localizacao;
        buffer[3] = status;
        buffer[4] = 0xEE;
        client.write(buffer, 5);
    }
}

int sizeCommand(uint8_t buf[20]){
    if( (buf[1] != AGV_NAME) && (buf[1] != 0x03)) return 0;
   
    for(int i = 0; i < 20; i++){
        if(buf[i] == 0xEE) return i;
    }
    return 0;
}

void decode(uint8_t buffer[20], int size){
    switch(buffer[0]){
        case CMD_MAN_service:
            Serial.println("Serviço");
            hasComand = true;
            trajectorySize = size - 3;
            trajectory[0] = AGV_NAME; //vIA DE ESTACIONAMENTO
            for(int i = 0; i < trajectorySize; i++){
                trajectory[i + 1] = buffer[i + 2];
            }
            if(AGV_NAME == 0){
                trajectory[trajectorySize + 1] = E1; 
                trajectorySize = trajectorySize + 2;
            }else if(AGV_NAME == 1){
                trajectory[trajectorySize + 1] = E5; 
                trajectory[trajectorySize + 2] = E2; 
                trajectorySize = trajectorySize + 3;
            }else{
                trajectory[trajectorySize + 1] = E5; 
                trajectory[trajectorySize + 2] = E3; 
                trajectorySize = trajectorySize + 3;
            }

            Serial.print("{");
            for(int j = 0; j < trajectorySize; j++){
                Serial.print(trajectory[j], HEX);
            }
            Serial.print("}");
      
            break; 

        case CMD_MAN_config:
            Serial.println("Config");
            break;

        case CMD_MAN_response:
            Serial.println("Response");
            response = buffer[2];
            newResponse = true;
            break;

        case CMD_MAN_status:
            Serial.println("Status");
            statusResponse();
            break;
    }
}

void client_available()
{
    if (client.connected()) {
        if (client.available()) {   
            uint8_t buffer[20] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
            client.read(buffer,20);
            // for (int i = 0; i < 20; i++){
            //     Serial.print(buffer[i], HEX);
            //     Serial.print(":");
            // }
            // Serial.println("");
            
            int size = sizeCommand(buffer);
            if(size){
                Serial.print("[Comando]: ");
                for (int i = 0; i < size; i++){
                    Serial.print(buffer[i], HEX);
                    Serial.print(":");
                }
                decode(buffer, size);
            }
        }
    } else {
        client.stop();
    }
}


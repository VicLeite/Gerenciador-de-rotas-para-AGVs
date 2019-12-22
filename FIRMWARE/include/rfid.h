#define TAG_1   "7E 90 77 8D"
#define TAG_2   "0A 8B 4D D3"
#define TAG_3   "4B B9 D1 22"
#define TAG_4   "9B B6 D8 22"
#define TAG_5   "EB B6 D7 22" 
#define TAG_6   "CA 5A E2 0A"
#define TAG_7   "DB 51 C9 22"
#define TAG_8   "4B 88 D5 22"
#define TAG_9   "2A 74 0A 0B"
#define TAG_10  "6A 39 13 0B"
#define TAG_11  "F0 70 AC C2" //"4B 89 C7 1B"
#define TAG_12  "84 33 8B 4D"//"4A 8E CA 0B"  
#define TAG_13  "9B CE C7 1B"
#define TAG_14  "5B 63 C4 1B"


void rfidInit(){
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
}

int rfidloop(){
  if (!mfrc522.PICC_IsNewCardPresent()) return 0;
  
  if (!mfrc522.PICC_ReadCardSerial()) return 0;

  String content= "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  content.toUpperCase();
  Serial.println();

  if( content.substring(1) == TAG_1){
    Serial.println(" TAG 1 "); return 1;
  } else if(content.substring(1) == TAG_2){
    Serial.println(" TAG 2 "); return 2;
  }else if(content.substring(1) == TAG_3){
    Serial.println(" TAG 3 "); return 3;
  }else if(content.substring(1) == TAG_4){
    Serial.println(" TAG 4 "); return 4;
  }else if(content.substring(1) == TAG_5){
    Serial.println(" TAG 5 "); return 5;
  }else if(content.substring(1) == TAG_6){
    Serial.println(" TAG 6 "); return 6;
  }else if(content.substring(1) == TAG_7){
    Serial.println(" TAG 7 "); return 7;
  }else if(content.substring(1) == TAG_8){
    Serial.println(" TAG 8 "); return 8;
  }else if(content.substring(1) == TAG_9){
    Serial.println(" TAG 9 "); return 9;
  }else if(content.substring(1) == TAG_10){
    Serial.println(" TAG 10 "); return 10;
  }else if(content.substring(1) == TAG_11){
    Serial.println(" TAG 11 "); return 11;
  }else if(content.substring(1) == TAG_12){
    Serial.println(" TAG 12 "); return 12;
  }else if(content.substring(1) == TAG_13){
    Serial.println(" TAG 13 "); return 13;
  }else if(content.substring(1) == TAG_14){
    Serial.println(" TAG 14 ");return 14;
  }else {
    Serial.println(" Access Denied "); return 0;
  }
}
/*
    Biblioteca para gerenciar e executar os estados da máquina
    --> Implementações futuras: 
        -Colocar o on Run para executar no timer 1 com desligar timer
        -Implementar recurso de execução assíncrona
*/
#ifndef MACHINE_H
#define MACHINE_H

typedef void (*TEvent)(void);
typedef struct {
    TEvent _onRun;    
} TSTATE;

class TMACHINE{
    private:
        TSTATE *Atual;
        bool _firstEntry = false;
        bool _changeState = false;
        void run(){
            Atual->_onRun();
        }
    public:
        void create(TSTATE *state, TEvent onRun){
            state->_onRun = onRun;
        }
        void initMachine(TSTATE *initState) {
            _firstEntry = true;
            Atual = initState; 
        }
        void runMachine(){
            Atual->_onRun();
            if (_changeState){
                _changeState = false;
                _firstEntry = true;
            }
            else _firstEntry = false;
        }
        void changeState(TSTATE *next){
            Atual = next;
            _changeState = true;
        }
        bool firstEntry() {
            return _firstEntry;
        }
};

#endif
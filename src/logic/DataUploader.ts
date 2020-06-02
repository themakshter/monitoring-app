const MINUTE = 1000 * 60;
const INTERVAL_DURATION = 1 * MINUTE;

export default class ServerLogic{
    static interval: number = -1;
    static temporaryData: any;
    static logic = () => {
        if(isServerAvailable()){
            uploadDataToServer(ServerLogic.temporaryData);
        }
    };
    static proceed = (data: any) => {
        ServerLogic.temporaryData = data;
        if(ServerLogic.interval == -1){
            ServerLogic.interval = setInterval(
                ServerLogic.logic,
                INTERVAL_DURATION
            );
        }
    };
}

function isServerAvailable(){
    //todo logic here;
    return true;
}

function uploadDataToServer(data: any){
    //todo logic here
    console.info("uploadingss to server", data);
}
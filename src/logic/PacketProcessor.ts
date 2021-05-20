import DataConfig from '../constants/DataConfig';

function PacketProcessor() {
  let SerialBuffer = new Array(0);
  let updateReadingStateFunction: (value: any) => void;
  let serialProcessingFunction: (
    packet: number[],
    callbackFunction: (value: any) => void,
  ) => void;

  function setCallbackFunction(callback: (value: any) => void): void {
    updateReadingStateFunction = callback;
  }

  function setProcessFunction(
    processFunction: (
      packet: number[],
      callbackFunction: (value: any) => void,
    ) => void,
  ): void {
    serialProcessingFunction = processFunction;
  }

  function processDataPacket(packet: number[]) {
    let RemainingData;
    if (SerialBuffer.length > 0) {
      if (packet.length >= DataConfig.totalPacketLength - SerialBuffer.length) {
        RemainingData = packet.splice(
          0,
          DataConfig.totalPacketLength - SerialBuffer.length,
        );

        SerialBuffer = SerialBuffer.concat(RemainingData);
        serialProcessingFunction(SerialBuffer, updateReadingStateFunction);
        SerialBuffer = [];
      } else {
        SerialBuffer = SerialBuffer.concat(packet);
      }
    } else {
      while (packet.length > 0) {
        if (
          packet[0] == 0x24 &&
          packet[1] == 0x4f &&
          packet[2] == 0x56 &&
          packet[3] == 0x50
        ) {
          if (packet.length >= DataConfig.totalPacketLength) {
            RemainingData = packet.splice(0, DataConfig.totalPacketLength);
            SerialBuffer = SerialBuffer.concat(RemainingData);
            serialProcessingFunction(SerialBuffer, updateReadingStateFunction);
            SerialBuffer = [];
          } else {
            SerialBuffer = SerialBuffer.concat(RemainingData);
            packet = [];
          }
        } else {
          packet.splice(0, 1);
        }
      }
    }
  }
  return {
    setCallbackFunction,
    setProcessFunction,
    handleDataPacket: processDataPacket,
  };
}

export default PacketProcessor();

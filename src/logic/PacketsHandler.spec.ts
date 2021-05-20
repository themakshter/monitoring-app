import PacketsHandler from './PacketsHandler';

test('verify correct packet handling', () => {
  const actualPacketReadings: number[][] = [];

  const appendActualReadings = (packet: number[]) => {
    actualPacketReadings.push(packet);
  };

  const dummyProcessFunction = (
    packet: number[],
    callback: (value: any) => void,
  ) => {
    callback(packet);
  };

  // prettier-ignore
  const testPackets: number[][] = [
    [36,79,86,80,41,163,10,0,164,132,104,89,8,128,5,126,109,164,11,245,194,1,55,44,33,20,35,0,70,192,166,156,51,156,104,14,248,15,214,0,168,1,0,0,30,61,185,145,13],
    [36,79,86,80,64,163,10,0,164,132,104,89,196,127,5,126,109,164,25,245,194,1,55,44,33,20,35,0,70,192,166,156,51,156,104,14,248,15,214,0,168,1,0,0,30,61,185,217,13],
    [36,79,86,80,88,163,10,0,164,132,152,89,149,127,5,126,109,164,17,245,194,1,55,44,33,20,35,0,70,192,166,156,51,156,104,14,248,15,214,0,168,1,0,0,30,61,185,104,13],
    [36,79,86,80,112,163,10,0,164,132,190,89,176,127,5,126,109,164,13,245,194,1,55,44,33,20,35,0,70,192,166,156,51,156,104,14,248,15,214,0,168,1,0,0,30,61,185,95,13],
    [36,79,86,80,136,163,10,0,164,132,190,89,244,127,5,126,109,164,251,244,194,1,55,44,33,20,35,0,70,192,166,156,51,156,104,14,248,15,214,0,168,1,0,0,30,61,185,20,13],
  ];

  const expectedPackets = JSON.parse(JSON.stringify(testPackets));

  PacketsHandler.setCallbackFunction(appendActualReadings);
  PacketsHandler.setProcessFunction(dummyProcessFunction);
  for (let testPacket of testPackets) {
    PacketsHandler.handleDataPacket(testPacket);
  }

  expect(actualPacketReadings).toStrictEqual(expectedPackets);
});

const { PythonShell } = require('python-shell');
const catchAsync = require('../utils/catchAsync');
const { spawn } = require('child_process');
let modelResultLabel = 'Normal';
// devices buffer
let devicesBuffer = {};
const passToAIModel = (data, id) => {
    const pyPro = spawn('python', ['./ai/model.py', JSON.stringify(data)]);
    pyPro.stdout.on('data', function (result) {
        // console.log(result.toString());
        let localSwimmerStatus = result
            .toString()
            .replace(/(\r\n|\n|\r)/gm, '');
        devicesBuffer[id].swimmerStatusDescription = localSwimmerStatus;
        if (
            localSwimmerStatus == 'ActiveDrowning' ||
            localSwimmerStatus == 'PassiveDrowning'
        ) {
            devicesBuffer[id].swimmerStatus = 'Drowning'; // or 'Drowning' | 'Normal
        } else {
            devicesBuffer[id].swimmerStatus = 'Normal'; // or 'Drowning' | 'Normal
        }
    });
    pyPro.stderr.on('data', function (data) {
        console.error(data.toString());
    });
};
exports.updateDeviceStatus = catchAsync(async (req, res, next) => {
    // get the data from the request
    let deviceStatus = {};
    let tempObjAcc = {};
    if (req.body) {
        deviceStatus.id = req.body.A;
        deviceStatus.time = req.body.C;
        deviceStatus.batteryLevel = req.body.D;
        deviceStatus.accelerometer = [];
        req.body.B.map((item) => {
            tempObjAcc = [item.X, item.Y, item.Z];
            deviceStatus.accelerometer.push(tempObjAcc);
        });
        deviceStatus.heartRate = req.body.E.H;
        deviceStatus.oxygenSaturation = req.body.E.S;
    }
    // save the data in the buffer
    devicesBuffer[deviceStatus.id] = deviceStatus;
    passToAIModel(deviceStatus.accelerometer, deviceStatus.id);
    // send the result to the client
    setTimeout(() => {
        res.status(200).json({
            status: 'success',
            swimmerStatus: deviceStatus.swimmerStatusDescription,
        });
    }, 2000);
});
exports.getHelp = catchAsync(async (req, res, next) => {
    // get the data from the request
    let deviceId = req.params.id;
    //  change the status in the buffer
    devicesBuffer[deviceId].swimmerStatus = 'Drowning';
    // send the result to the client
    res.status(200).json({
        status: 'success',
    });
});
exports.getDeviceStatus = catchAsync(async (req, res, next) => {
    // get the data from the request
    let deviceId = req.params.id;
    // get the data from the buffer
    let deviceStatus = devicesBuffer[deviceId];
    // send the result to the client
    res.status(200).json({
        status: 'success',
        data: {
            deviceStatus,
        },
    });
});

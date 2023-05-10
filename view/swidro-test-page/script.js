const bpm = document.querySelector('#heart-value');
const so2 = document.querySelector('#oxygen-value');
const xValue = document.querySelector('#x-value');
const yValue = document.querySelector('#y-value');
const zValue = document.querySelector('#z-value');
const battery = document.querySelector('#battery-level');
const DrowningLable = document.querySelector('.drowning-status');
const NormalLable = document.querySelector('.normal-status');
let bpmValue = 0;
let o2 = 0;
let accelo = { x: 0, y: 0, z: 0 };
let batteryLevel = 0;
let swimmerStatus = 'Normal';
let swimmerStatusDescription = 'Sitting';
// period in ms
const period = 1000;
// url to the server
const url = 'http://127.0.0.1:5000/api';
const saveDataBpm = (data) => {
    bpmValue = data;
    bpm.innerHTML = bpmValue;
};
const saveDataO2 = (data) => {
    o2 = data;
    so2.innerHTML = o2;
};
const saveDataAcc = (data) => {
    accelo = data;
    xValue.innerHTML = accelo.x;
    yValue.innerHTML = accelo.y;
    zValue.innerHTML = accelo.z;
};
const saveDataBattery = (data) => {
    batteryLevel = data;
    battery.innerHTML = batteryLevel;
};

const showSwimmerStatus = () => {
    if (swimmerStatus === 'Drowning') {
        DrowningLable.style.display = 'block';
        NormalLable.style.display = 'none';
        if (swimmerStatusDescription) {
            DrowningLable.innerHTML = swimmerStatusDescription;
        } else {
            DrowningLable.innerHTML = 'Drowning';
        }
    } else {
        DrowningLable.style.display = 'none';
        NormalLable.style.display = 'block';
        if (swimmerStatusDescription) {
            NormalLable.innerHTML = swimmerStatusDescription;
        } else {
            NormalLable.innerHTML = 'Normal';
        }
    }
};
const getDeviceStatus = () => {
    axios
        .get(`${url}/device/1212`)
        .then((response) => {
            if (response.data.data.deviceStatus) {
                saveDataBpm(response.data.data.deviceStatus.heartRate);
                saveDataO2(response.data.data.deviceStatus.oxygenSaturation);
                saveDataBattery(response.data.data.deviceStatus.batteryLevel);
                swimmerStatus = response.data.data.deviceStatus.swimmerStatus;
                swimmerStatusDescription =
                    response.data.data.deviceStatus.swimmerStatusDescription;
            }
        })
        .catch((error) => {
            console.error('The Error:', error);
        });
};

const main = async () => {
    await getDeviceStatus();
};
setInterval(function () {
    getDeviceStatus();
    showSwimmerStatus();
}, period);

// getDeviceStatus();

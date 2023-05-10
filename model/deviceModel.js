const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: Number,
        required: [true, 'A device must have a deviceId'],
    },
    resort: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resort',
    },
});
// document middlewares
deviceSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'resort',
        select: 'name',
    });
    next();
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;

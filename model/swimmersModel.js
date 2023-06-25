const mongoose = require('mongoose');

const swimmersSchema = new mongoose.Schema({
    deviceId: {
        type: Number,
        required: [true, 'A device must have a deviceId'],
    },
    name: {
        type: String,
        default: 'Swimmers',
        required: [true, 'A swimmer must have a name'],
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'a gender is required'],
    },
    status: {
        type: String,
        default: 'normal',
        enum: ['normal', 'help'],
    },
    age: {
        type: Number,
        required: [true, 'A swimmer must have an age'],
    },
    amenity: {
        type: String,
        required: [true, 'A swimmer must have an amenity'],
    },
    resort: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resort',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});
// document middlewares
swimmersSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'resort',
        select: 'name',
    });
    next();
});

const Swimmers = mongoose.model('Swimmers', swimmersSchema);
module.exports = Swimmers;

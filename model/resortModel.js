const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A resort must have a name'],
    },
    location: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Resort must belong to a owner'],
    },
});

resortSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name',
    });
    next();
});
const Resort = mongoose.model('Resort', resortSchema);
module.exports = Resort;

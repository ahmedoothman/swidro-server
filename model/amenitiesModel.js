const mongoose = require('mongoose');

const amenitiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A amenities must have a name'],
    },
    resort: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resort',
    },
});
// document middlewares
amenitiesSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'resort',
        select: 'name',
    });
    next();
});

const Amenities = mongoose.model('Amenities', amenitiesSchema);
module.exports = Amenities;

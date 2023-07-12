const Swimmers = require('../model/swimmersModel');
const Device = require('../model/deviceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getSwimmers = factory.getOne(Swimmers);
exports.updateSwimmers = factory.updateOne(Swimmers);
exports.deleteSwimmers = factory.deleteOne(Swimmers);
exports.getAllSwimmers = factory.getAll(Swimmers);
exports.createSwimmers = catchAsync(async (req, res, next) => {
    const { name, gender, age, deviceId, amenity, resort } = req.body;
    // check if the data is undefined
    if (!name) {
        return next(new AppError('Please provide name', 400));
    }
    if (!gender) {
        return next(new AppError('Please provide a gender', 400));
    }
    if (!age) {
        return next(new AppError('Please provide a age', 400));
    }
    if (!deviceId) {
        return next(new AppError('Please provide a deviceId', 400));
    }
    if (!amenity) {
        return next(new AppError('Please provide a amenity', 400));
    }
    if (!resort) {
        return next(new AppError('Please provide a resort', 400));
    }

    // check if deviceId exists in device collection
    const device = await Device.findOne({ deviceId });
    if (!device) {
        return next(new AppError(`This device doesn't exists`, 400));
    }
    // check if deviceId is already exists today
    const swimmer = await Swimmers.findOne({
        deviceId,
        date: {
            $gte: new Date().setHours(00, 00, 00),
            $lt: new Date().setHours(23, 59, 59),
        },
    });
    if (swimmer) {
        return next(new AppError('This device is already taken', 400));
    }
    const newSwimmerFiltered = {
        name,
        gender,
        age,
        deviceId,
        amenity,
        resort,
    };

    const newSwimmer = await Swimmers.create(newSwimmerFiltered);
    res.status(200).json({
        status: 'success',
        data: newSwimmer,
    });
});
// function that get the swimmers that have been svaved today and with resort id
exports.getSwimmersByDate = catchAsync(async (req, res, next) => {
    const resortId = req.user.resort._id;
    // const amenity = req.params.amenity;
    // if (amenity === 'POOL') {
    //     return;
    // }
    const swimmers = await Swimmers.find({
        resort: resortId,
        date: {
            $gte: new Date().setHours(00, 00, 00),
            $lt: new Date().setHours(23, 59, 59),
        },
    });
    res.status(200).json({
        status: 'success',
        results: swimmers.length,
        data: swimmers,
    });
});

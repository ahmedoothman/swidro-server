const Resort = require('../model/resortModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createResort = catchAsync(async (req, res, next) => {
    const { name, location } = req.body;
    if (!name || !location) {
        return next(new AppError('Please provide name and location', 400));
    }
    const newResortFiltered = {
        name,
        location,
        owner: req.user._id,
    };

    const newResort = await Resort.create(newResortFiltered);

    res.status(200).json({
        status: 'success',
        message: 'verify token sent to email',
    });
});
exports.getResort = catchAsync(async (req, res, next) => {
    // find resort by ownerId
    const resort = await Resort.findOne({ owner: req.user._id });
    if (!resort) {
        return next(new AppError('No resort found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: resort,
    });
});

exports.deleteResort = factory.deleteOne(Resort);
exports.upateResort = factory.updateOne(Resort);
exports.getAllResorts = factory.getAll(Resort);

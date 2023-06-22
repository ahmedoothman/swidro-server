const Amenities = require('../model/amenitiesModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createAmenities = catchAsync(async (req, res, next) => {
    const resortId = req.user.resort._id;
    const { name } = req.body;
    if (!name) {
        return next(new AppError('Please provide amenities name', 400));
    }
    const newDeviceFiltered = {
        name,
        resort: resortId,
    };
    const newAmenities = await Amenities.create(newDeviceFiltered);
    res.status(200).json({
        status: 'success',
        data: newAmenities,
    });
});
exports.getAllAmenities = catchAsync(async (req, res, next) => {
    const resortId = req.user.resort._id;
    const amenities = await Amenities.find({ resort: resortId });
    res.status(200).json({
        status: 'success',
        results: amenities.length,
        data: amenities,
    });
});
exports.getAmenities = factory.getOne(Amenities);
exports.updateAmenities = factory.updateOne(Amenities);
exports.deleteAmenities = factory.deleteOne(Amenities);

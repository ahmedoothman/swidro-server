const User = require('./../model/userModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.addStaff = catchAsync(async (req, res, next) => {
    const { userName, password, passwordConfirm, role, resortId } = req.body;
    const email = new Date().getTime() + '@gmail.com';
    if (!userName || !password || !passwordConfirm) {
        return next(
            new AppError(
                'Please provide userName, password and passwordConfirm',
                400
            )
        );
    }
    const newStaffFiltered = {
        userName,
        password,
        passwordConfirm,
        role,
        email,
        resort: resortId,
    };

    const newStaff = await User.create(newStaffFiltered);

    res.status(201).json({
        status: 'success',
        message: 'Staff created',
        data: newStaff,
    });
});

exports.getAllStaff = catchAsync(async (req, res, next) => {
    const staff = await User.find({ resort: req.params.id });
    if (!staff) {
        return next(new AppError('No staff found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        results: staff.length,
        data: staff,
    });
});

exports.getStaff = factory.getOne(User);
exports.updateStaff = factory.updateOne(User);
exports.deleteStaff = factory.deleteOne(User);

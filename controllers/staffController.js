const User = require('./../model/userModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.addStaff = catchAsync(async (req, res, next) => {
    const resortId = req.user.resort._id;
    const { userName, password, passwordConfirm, role } = req.body;
    const email = new Date().getTime() + '@gmail.com';
    if (!userName || !password || !passwordConfirm || !role || !resortId) {
        return next(
            new AppError(
                'Please provide userName, password and passwordConfirm',
                400
            )
        );
    }
    const notExistUserName = await User.find({ userName });
    if (!!notExistUserName[0]) {
        return next(new AppError('User name already exist', 400));
    }
    const newStaffFiltered = {
        userName,
        password,
        passwordConfirm,
        role,
        email,
        resort: resortId,
        verified: true,
    };

    const newStaff = await User.create(newStaffFiltered);

    res.status(201).json({
        status: 'success',
        message: 'Staff created',
        data: newStaff,
    });
});

exports.getAllStaff = catchAsync(async (req, res, next) => {
    const staff = await User.find({ resort: req.user.resort._id });
    if (!staff) {
        return next(new AppError('No staff found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        results: staff.length,
        data: staff,
    });
});
// update staff and save it to run pre save middleware
exports.updateStaff = catchAsync(async (req, res, next) => {
    const { userName, password, passwordConfirm, role } = req.body;
    const staffId = req.params.id;
    if (!userName || !password || !passwordConfirm || !role) {
        return next(
            new AppError(
                'Please provide userName, password and passwordConfirm',
                400
            )
        );
    }
    const staff = await User.findById(staffId);
    if (!staff) {
        return next(new AppError('No staff found with that ID', 404));
    }
    staff.userName = userName;
    staff.password = password;
    staff.passwordConfirm = passwordConfirm;
    staff.role = role;
    await staff.save();
    res.status(200).json({
        status: 'success',
        message: 'Staff updated',
        data: staff,
    });
});

exports.getStaff = factory.getOne(User);
exports.deleteStaff = factory.deleteOne(User);

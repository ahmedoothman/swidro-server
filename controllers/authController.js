const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const Resort = require('./../model/resortModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

// read host url from env file
const appURL = process.env.APP_URL;

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
/***************************************************************************/
/* Name : createSendToken */
/* Description : create token for user then send it */
/***************************************************************************/
const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, //cookie cannot be modified or accessed by the browser to prevent scripting attack
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //when we use https
    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    // get resort
    let resort;
    if (user.role === 'owner') {
        resort = await Resort.findOne({ owner: user._id });
    } else {
        resort = user.resort;
    }
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
            resort,
        },
    });
};

/***************************************************************************/
/* Name : signup */
/* Description : create new user */
/***************************************************************************/
exports.signup = catchAsync(async (req, res, next) => {
    // check if resort already exists
    const { name: resortName } = req.body;
    const resort = await Resort.findOne({ name: resortName });
    if (resort) {
        return next(
            new AppError(
                'Org Name Already Exists, Please Choose a Different Name',
                400
            )
        );
    }
    // check user data
    if (!req.body.email || !req.body.password || !req.body.passwordConfirm) {
        return next(
            new AppError(
                'Missing Data Please Fill all the Fields to Create an Account',
                400
            )
        );
    }
    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        userName: req.body.userName.toLowerCase(),
        role: 'owner',
    });
    const verifyToken = await newUser.createAccountVerifyToken();
    await newUser.save({ validateBeforeSave: false });

    const verifyURL = `${appURL}/verify-email/${verifyToken}`;
    try {
        new sendEmail(
            { email: newUser.email, name: newUser.userName },
            verifyURL
        ).verifyEmail();
        req.user = newUser;
        // we pass to the next middleware thar create a resort
        next();
    } catch (err) {
        newUser.accountverifyToken = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'there was an error sending the email. try again later!'
            ),
            500
        );
    }
});

/***************************************************************************/
/* Name : verifyEmail */
/* Description : verify user email */
/***************************************************************************/
exports.verifyEmail = catchAsync(async (req, res, next) => {
    //1) find user by token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ accountVerifyToken: hashedToken });

    //2) check if user is already verified
    if (!user) {
        return next(new AppError('your email is already verified!', 400));
    }
    //3) Verifiy account
    user.verified = true;
    user.accountverifyToken = undefined;
    await user.save({ validateBeforeSave: false });
    //4) response success
    res.status(200).json({
        status: 'success',
        message: 'your account is verified',
    });
});

/***************************************************************************/
/* Name : login */
/* Description : login user */
/***************************************************************************/
exports.login = catchAsync(async (req, res, next) => {
    const { userName, password } = req.body;

    // 1) Check if email and password exist
    if (!userName || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const userNameLowerCase = userName.toLowerCase().trim();
    const user = await User.findOne({ userName: userNameLowerCase }).select(
        '+password'
    );

    if (!user) {
        return next(new AppError('User Not Found', 400));
    }
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
        return next(new AppError('Incorrect userName or password', 401));
    }

    //3) check if the email is verified
    if (!user.verified) {
        return next(new AppError('your email is not verified', 401));
    }

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res);
});

/***************************************************************************/
/* Name : logout */
/* Description : logout user */
/***************************************************************************/
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

/***************************************************************************/
/* Name : protect */
/* Description : protect routes */
/***************************************************************************/
exports.protect = catchAsync(async (req, res, next) => {
    //1) get Token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401
            )
        );
    }

    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    const resort = await Resort.findOne({ owner: decoded.id });
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token no longer exists.',
                401
            )
        );
    }

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }
    let tempUser;
    if (currentUser.role === 'admin' || resort) {
        tempUser = { ...currentUser._doc, resort: resort._doc };
    } else {
        const resort = currentUser.resort;
        tempUser = { currentUser, resort };
    }
    // Grant Access
    // expand current user and  resort to the request
    req.user = tempUser;
    // req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

/***************************************************************************/
/* Name : restrictTo */
/* Description : restrict access to roles */
/***************************************************************************/
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }
        next();
    };
};

/***************************************************************************/
/* Name : updatePassword */
/* Description : update user password */
/***************************************************************************/
exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) get user
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        return next(new AppError('There is no user with that id.', 404));
    }

    //2 check  current password
    const correctPass = await user.correctPassword(
        req.body.passwordCurrent,
        user.password
    );
    if (!correctPass) {
        return next(new AppError('Current password is not correct', 401));
    }
    //3 update user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //4 log user in
    createSendToken(user, 200, res);
});

/***************************************************************************/
/* Name : forgotPassword */
/* Description : forgot password */
/***************************************************************************/
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('there is no user with that email', 404));
    }
    //2) Generate random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3)send it to user email

    const resetURL = `${appURL}/reset-password/${resetToken}`;

    try {
        new sendEmail(
            { email: user.email, name: user.userName },
            resetURL
        ).sendResetPassword();

        res.status(200).json({
            status: 'success',
            message: 'token sent to email',
        });
    } catch (err) {
        user.PasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'there was an error sending the email. try again later!'
            ),
            500
        );
    }
});

/***************************************************************************/
/* Name : resetPassword */
/* Description : reset password */
/***************************************************************************/
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) hash token and get user
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    //2) check if user exists or token has expired
    if (!user) {
        return next(new AppError('token is expired or invalid', 400));
    }
    //3) update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //4)log user in
    createSendToken(user, 200, res);
});

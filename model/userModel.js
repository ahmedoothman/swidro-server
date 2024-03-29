const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email'],
        required: [true, 'please provide an email'],
    },
    userName: {
        type: String,
        required: [true, 'User must have a username '],
        unique: true,
    },
    role: {
        type: String,
        enum: ['lifeguard', 'admin', 'manager', 'owner'],
        default: 'lifeguard',
    },
    password: {
        type: String,
        required: [true, 'please Provide a password'],
        minlength: 8,
        select: false, //not shown in response
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same',
        },
        //select:false
    },
    passwordChangedAt: {
        type: Date,
        required: [false],
    },
    resort: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resort',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    accountVerifyToken: String,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
        select: true,
    },
    accountCreatedAt: {
        type: Date,
        required: [false],
        default: new Date(),
    },
});
userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'resort',
        select: 'name',
    });
    next();
});
//hash password when creating or updating user we know that because the password is modified
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    } else {
        return next();
    }
});
// pre update check if there  password update it
// userSchema.pre('findByIdAndUpdate', async function (next) {
//     if (this._update.password) {
//         this._update.password = await bcrypt.hash(this._update.password, 12);
//         this._update.passwordConfirm = undefined;
//         next();
//     } else {
//         return next();
//     }
// });
//add the date of the cahnged password
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

//methods to the schema we need

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //expires in 10 mins

    return resetToken;
};

userSchema.methods.createAccountVerifyToken = function () {
    const verifyToken = crypto.randomBytes(32).toString('hex');
    this.accountVerifyToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');
    return verifyToken;
};
// hash password
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 12);
};
const User = mongoose.model('User', userSchema);
module.exports = User;

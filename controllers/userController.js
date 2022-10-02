const { register } = require('../database');
const validator = require('validator');

const signup = async (req, res) => {
    const { email, password } = req.body;
    var failVal = {};
    var failMsg = [];
    if (!email) {
        failVal.email = true;
        failMsg.push("Email field can NOT be empty");
    }
    if (!password) {
        failVal.pass = true;
        failMsg.push("Password field can NOT be empty");
    }
    if (failMsg.length > 0) {
        return res.status(406).json({ error: "Failed to register", failVal, failMsg });
    }
    if (!validator.isEmail(email)) {
        failVal.email = true;
        failMsg.push("Email is not valid!");
    }
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })) {
        failVal.pass = true;
        failMsg.push("Password is too weak. Make sure your password has uppercase, lowercase, number and special symbol");
    }
    if (failMsg.length === 0) {
        try {
            const user = await register(email, password);
            res.status(200).json({ msg: "Registered", user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    } else {
        res.status(406).json({ error: "Failed to register", failVal, failMsg })
    }
}

const login = async (req, res) => {

}

module.exports = {
    signup, login
}
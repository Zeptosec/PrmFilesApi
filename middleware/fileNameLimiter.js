
const fileNameLimiter = (req, res, next) => {
    const files = req.files;
    let overLimit = false;
    Object.keys(files).forEach(key => {
        if (files[key].name.length > 42) {
            overLimit = true;
        }
    });
    if(overLimit){
        return res.status(406).json({error: "File name is too long. Max length is 42 with extension."});
    }
    next();
}
module.exports = fileNameLimiter;
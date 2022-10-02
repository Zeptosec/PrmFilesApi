const MB = 8;
const FileSizeLimit = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;
    const filesOverLimit = [];
    Object.keys(files).forEach(key => {
        if (files[key].size > FileSizeLimit) {
            filesOverLimit.push(files[key].name)
        }
    });
    if (filesOverLimit.length > 0) {
        return res.status(413).json({ error: "Some files are too big. Limit is 8MB." });
    }
    next();
}
module.exports = fileSizeLimiter;
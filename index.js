require('dotenv').config()
const express = require('express')

const fileUpload = require('express-fileupload')
const fileSizeLimiter = require('./middleware/fileSizeLimiter');
const fileNameLimiter = require('./middleware/fileNameLimiter');

//const { AddFileToDB } = require('./database');
const { saveFile } = require('./bot');

//const userRoutes = require('./routes/user');

var cors = require('cors')
const app = express()
app.use(cors({}));
app.use(express.json());

//app.use('/api/user', userRoutes);

app.get('/', function (req, res) {
    res.send('Hello Worldd')
    saveFile("asd");
})

app.post('/api/upload',
    fileUpload({ createParentPath: true }),
    fileSizeLimiter,
    fileNameLimiter,
    async (req, res) => {
        const files = req.files;
        const location = await saveFile(files.file);
        //const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        //await AddFileToDB(location, files.file.name, ip, null);
        res.status(200).json({ msg: "File saved!", location });
    })

app.listen(process.env.PORT || 3000)
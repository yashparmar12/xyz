import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb){ //here file is user wants to upload a file
        return cb(null, "../upload"); //null means no error
    },

    filename: function (req, file, cb) {
        
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage});

export default upload;
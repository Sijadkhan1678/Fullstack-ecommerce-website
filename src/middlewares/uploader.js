const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination funcion is called")
    if (file.fieldname === "categoryImage") {
      cb(null, './public/category')

    }
    if (file.fieldname === "profileImage") {
      cb(null, './public/profile')

    }
  },
  filename: function (req, file, cb) {
    console.log("filename function is called")
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split('/')[1])
  }
})
const upload = multer({
  storage: storage,
  fileFilter: checkFileExtension,
  // limits: {
  //     fileSze: 1024 * 1024 * 3 
  // }
})

function checkFileExtension(req, file, cb) {
  const extension = file.mimetype.split("/")[1]
  const allowedExtensions = {
    jpeg: "jpeg",
    png: "png"
  }
  // console fileName = 
  if (!allowedExtensions[extension]) {
    const error = new Error("image type should be (jpeg , png)")
    error.code = "TYPE_INVALID"
    return cb(error)
  }
  return cb(null, true)
  // return cb("Image wrong Type, image type should be (jpeg , png)", false)

}

function categoryImageUPloader(req, res, next) {

  upload.single("categoryImage")(req, res, (err) => {
    console.log("category uploader middlware function called")

    if (err instanceof multer.MulterError) {

      return res.status(400).json({ success: false, uploadError: 'File upload Error', error: err });

    } else if (err?.code == "TYPE_INVALID") {

      return res.status(400).json({
        success: false,
        error: {
          type: err.code,
          message: err.message
        }
      });

    } else if (err) {
      return res.status(400).json({
        success: false,
        error: {
          ...err
        }
      });
    }

    next()
  })

}
module.exports = categoryImageUPloader
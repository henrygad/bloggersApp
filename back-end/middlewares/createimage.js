const imageFiles = require('../schema/imagefilesSchema')
const { customError } = require('../middlewares/error')

const createimage = async (req, res, next) => {

    try {
        // create new image
        if (typeof req.file === 'object') {

            const addImage = await imageFiles.create({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                fileName: req.file.originalname,
                size: req.file.size,
                fieldname: req.file.fieldname,
                uploader: req.authorizeUser
            })

            if (!addImage) throw new Error('bad request: image not save')

            // assign image to request
            req.image = addImage._id
        }
        next()

    } catch (error) {

        next(new customError(error, 400))
    }

}


module.exports = createimage
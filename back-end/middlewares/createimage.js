const imageFiles = require('../schema/imagefilesSchema')
const { customError } = require('../middlewares/error')

const createimage = async (req, res, next) => {
    const {file, authorizeUser} = req;

    try {
        // create new image
        if (typeof req.file === 'object') {
            const addImage = await imageFiles.create({
                data: file.buffer,
                contentType: file.mimetype,
                fileName: file.originalname,
                size: file.size,
                fieldname: file.fieldname,
                uploader: authorizeUser
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
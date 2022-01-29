import express from 'express'
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {
    create,
    postById,
    read,
    remove,
    update,
    list,
    listRelated,
    listByUser,
    listByMonth,
    listCategories,
    listBycategory,
    listBySearch,
    listSearch,
} = require('../controllers/post')
const { userById } = require('../controllers/user')

router.post('/v1/post/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete(
    '/v1/post/:postId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
)
router.put('/v1/post/:postId/:userId', requireSignin, isAuth, isAdmin, update)
router.get('/v1/post/:postId', read)
router.get('/v1/posts', list)
router.get('/v1/posts/search', listSearch)
router.get('/v1/posts/related/:postId', listRelated)
router.get('/v1/posts/:userId/', listByUser)
router.get('/v1/posts/by/:categoryId/', listBycategory)
router.get('/v1/posts/categories', listCategories)
router.post('/v1/posts/by/search', listBySearch)
router.post('/v1/posts/by/search', listByMonth)
router.param('userId', userById)
router.param('postId', postById)

module.exports = router

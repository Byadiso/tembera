import express from 'express'
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {
    create,
    moneyById,
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
} = require('../controllers/money')
const { userById } = require('../controllers/user')

router.post('/v1/money/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete(
    '/v1/money/:moneyId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
)
router.put('/v1/money/:moneyId/:userId', requireSignin, isAuth, isAdmin, update)
router.get('/v1/money/:moneyId', read)
router.get('/v1/moneys', list)
router.get('/v1/moneys/search', listSearch)
router.get('/v1/moneys/related/:moneyId', listRelated)
router.get('/v1/moneys/:userId/', listByUser)
router.get('/v1/moneys/by/:categoryId/', listBycategory)
router.get('/v1/moneys/categories', listCategories)
router.post('/v1/moneys/by/search', listBySearch)
router.post('/v1/moneys/by/search', listByMonth)
router.param('userId', userById)
router.param('moneyId', moneyById)

module.exports = router

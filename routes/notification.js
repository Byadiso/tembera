import  express from 'express';
import  bodyParser from 'body-parser';
import session from 'express-session';
import getNotification from '../controllers/notification';
import latestNotification from '../controllers/notification';
import singleMarkAsOpened from '../controllers/notification';
import markAsOpened from '../controllers/notification';
import getAllNotification from '../controllers/notification';

const router = express.Router();

router.get('/notification',getNotification);
router.get('/notification/latest',latestNotification);
router.put('/:id/markAsOpened', singleMarkAsOpened)
router.put('/markAsOpened', markAsOpened)
router.get('/', getAllNotification)

    
module.exports = router;


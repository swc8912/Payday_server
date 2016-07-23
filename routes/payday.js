var express = require('express');
var router = express.Router();
var payday = require('../handlers/payday');

router.post('/', payday.create);
//router.post('/user', payday.readUser);
router.get('/', payday.read);
router.put('/', payday.update);
router.delete('/', payday.remove);

module.exports = router;
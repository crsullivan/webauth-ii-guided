const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username; // add properties to existing session object, dont overwrite with new obj
        res.status(200).json({
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(error => {
      if(error) {
        res
          .status(500)
          .json({ message: 'probs'})
      } else {
          res.status(200).json({message: 'logged out'})
      }
    });
  } else {
    res.status(200).json({ message: 'bye felicia'})
  }
})
module.exports = router;

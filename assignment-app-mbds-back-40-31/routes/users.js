let User = require('../model/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
var config = require('../config');

// Récupérer tous les assignments (GET)
function getUsersSansPagination(req, res) {
    User.find((err, user) => {
        if (err) {
            res.send(err)
        }

        res.send(user);
    });
}

function getUsers(req, res) {
    var aggregateQuery = User.aggregate();

    User.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, user) => {
            if (err) {
                res.send(err);
            }
            res.send(user);
        }
    );
}
function getEtudiants(req, res) {
    var aggregateQuery = User.aggregate([
        {
          $match: {
            poste: "etudiant"
          }
        }
      ]);
      
      User.aggregatePaginate(aggregateQuery, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      }, (err, user) => {
        if (err) {
          res.send(err);
        }
        res.send(user);
      });
}

  
// Récupérer un user par son id (GET)
function getUser(req, res) {
    let userID = req.params.id;

    User.findOne({ id: userID }, (err, user) => {
        if (err) { res.send(err) }
        res.json(user);
    })
}

//authentification user
function loginUser(req, res) {
    let userEmail = req.body.email;
    User.findOne({ email: userEmail }, (err, user) => {
        if (err) {
            res.send(err);
        }
        if(user == null){
            return res.status(401).send({ auth: false, token: null });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send({ auth: false, token: null });
        }
        res.json(user);
    });
}

// Ajout d'un user (POST)
function postUser(req, res) {
    let user = new User();
    user.id = req.body.id;
    user.nom_complet = req.body.nom_complet;
    user.email = req.body.email;
    user.password = hashPassword(req.body.password);
    user.poste = req.body.poste;
    
    console.log("POST user reçu :");
    console.log(user)

    user.save((err) => {
        if (err) {
            res.send('cant post user ', err);
        }
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    });
}

// Update d'un user (PUT)
function updateUser(req, res) {
    console.log("UPDATE recu user : ");
    console.log(req.body);

    User.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: user.nom + 'updated' })
        }

        // console.log('updated ', user)
    });

}

// suppression d'un user (DELETE)
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${user.nom} deleted` });
    })
}

function hashPassword(password) {
    return bcrypt.hashSync(password, 8);
}

module.exports = { getUsers, postUser, getUser, updateUser, deleteUser, loginUser, getEtudiants };

let Assignment = require('../model/assignment');
let assignmentComplet =  require('../model/assignmentComplet');
// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}

function getAssignments(req, res) {
    var aggregateQuery = assignmentComplet.aggregate();
    
    assignmentComplet.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        console.log("Tsy misy erreurs ary kou");
        res.send(assignments);
      }
    );
   }
   
// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    assignmentComplet.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    // assignment.dateAttribution = req.body.dateAttribution; Atao date actuel
    assignment.remarque = req.body.remarque;
    assignment.note = req.body.note;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.idMatiere = req.body.idMatiere;
    assignment.idEtudiant = req.body.idEtudiant;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json(assignment);
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: assignment.nom + 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

//rendre un assignment
function rendreAssignment(req, res) {
    console.log(" Rendre assignment : " + req.query.id);
    var update = {
        note : req.query.note,
        dateDeRendu : new Date(),
        rendu : true
    };
    Assignment.findByIdAndUpdate(req.query.id, update, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            if(assignment!=null){
                res.json({message: assignment.nom + 'rendu et updated'})
            }
        }

      // console.log('updated ', assignment)
    });

}
// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom_complet} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, rendreAssignment };

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { User } from 'src/app/users/users.component.model';
import { Matiere } from '../matiere.model';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Assignment } from '../assignment.model';
import { UsersService } from 'src/app/shared/users.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  // associées aux champs du formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;
  remarque!: string;
  note!: number;
  idEtudiant!: number;
  idMatiere!: number;
  matieres: Matiere[] = [];
  // userConnecte?:User;

  constructor(
    private assignmentsService: AssignmentsService,
    private matiereService: MatiereService,
    private userService : UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAssignment();
    this.getMatieres();
    if(localStorage.getItem(AuthService.userSessionKey)!=null){
      this.labelConnexion = "SE DECONNECTER";
    }
    else{
      this.labelConnexion = "SE CONNECTER";
    }
    this.userService.getUser()
    .subscribe((user) => {
        this.userConnecte = user;
        if(user == null){
          this.router.navigate(['/login']);
        }
    });
  }
  getMatieres(){
    this.matiereService.getMatieres(0, 0).subscribe(data => {
      this.matieres = data.docs;
      console.log("Données reçues");
      console.log(data);
    });
  }
  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    // Exemple de récupération des query params (après le ? dans l'url)
    //const queryParams = this.route.snapshot.queryParams;
    //console.log(queryParams);
    //console.log("nom :" + queryParams['nom'])
    //console.log("matière :" + queryParams['matiere'])

    // Exemple de récupération du fragment (après le # dans l'url)
    //const fragment = this.route.snapshot.fragment;
    //console.log("Fragment = " + fragment);

    this.assignmentsService.getAssignment(id)
      .subscribe((assignment) => {
        if (!assignment) return;
        this.assignment = assignment;
        // Pour pré-remplir le formulaire
        this.nomAssignment = assignment.nom;
        this.remarque = assignment.remarque;
        this.dateDeRendu = assignment.dateDeRendu;
        this.idEtudiant = assignment.idEtudiant;
        this.idMatiere = assignment.matiere.id;
        this.note = assignment.note;
      });
  }
  onSaveAssignment() {
    if (!this.assignment) return;
    if(this.note > 20 || this.note < 0)return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    // this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.remarque = this.remarque;
    this.assignment.idEtudiant = this.idEtudiant;
    this.assignment.idMatiere = this.idMatiere;
    this.assignment.note = this.note;
    if(this.dateDeRendu!=null && this.note!=null){
      this.assignment.dateDeRendu = this.dateDeRendu;
      this.assignment.rendu = true;
    }
    else{
      alert("Pas de note ==> non rendu");
    }
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);

        // navigation vers la home page
        this.router.navigate(['/assignments/'+this.assignment?.id]);
      });
  }
     
  labelConnexion! : string;
  nom:string = "";
  currentRoute:string = "";
  userConnecte?:User;

  isLogged() {
    return localStorage.getItem(AuthService.userSessionKey)!=null;
  }
  login() {

    // utilise l'authService pour se connecter
    if(this.userConnecte != null) {
      //this.authService.logOut();
      localStorage.removeItem(AuthService.userSessionKey);
      //deconnexion et lien vers connexion
      // et on navigue vers la page d'accueil
    }
    this.router.navigate(["/login"]);
  }
  // if(localStorage.getItem(AuthService.userSessionKey)!=null){
  //   this.labelConnexion = "Se déconnecter";
  // }
  // else{
  //   this.labelConnexion = "Se connecter";
  // }
}

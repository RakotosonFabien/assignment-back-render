import { User } from "../users/users.component.model";
import { Matiere } from "./matiere.model";
// interface Matiere {
//     id: number;
//     nom: string;
//     remarque: string;
//   }
  
  // Définition de l'interface pour le professeur
export class Assignment {
    _id!: string;
    id!: number;
    nom!: string;
    dateAttribution! : Date;
    remarque! : string;
    note!:number;
    dateDeRendu!: Date;
    rendu!: boolean;
    idEtudiant!:number;
    idMatiere!:number;
    etudiant!:User;
    matiere!: Matiere;
    professeur!: User;
}

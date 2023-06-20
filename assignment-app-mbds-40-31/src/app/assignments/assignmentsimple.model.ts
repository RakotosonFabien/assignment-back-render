
// Définition de l'interface pour la creation de devoir
export class AssignmentSimple {
    _id!: string;
    id!: number;
    nom!: string;
    dateAttribution! : Date;
    remarque! : string;
    note!:number;
    dateDeRendu!: Date;
    rendu!: boolean;
    idEtudiant!:number;
    idMatiere!: number;
}

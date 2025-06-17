export interface IAdmin {
  email: string;
  password: string;
}

// interface TeamData {
//   name: string;
//   sets: number;
//   points: number[];
//   errors: {
//     unForcedError: number;
//     errorCounterAttack: number;
//     errorAttack: number;
//     errorServe: number;
//     totalErrors: number;
//   };
//   pointsByType: {
//     attack: number;
//     serve: number;
//     block: number;
//     forcedError: number;
//     unforced: number;
//     unForcedError: number; // parece redundante con "unforced", pero lo incluyo por si lo usás aparte
//     errorCounterAttack: number;
//     errorAttack: number;
//     errorServe: number;
//   };
// }

// interface SetData {
//   team1Points: number;
//   team2Points: number;
//   pointsLog: any[]; // Si sabés qué estructura tiene el log de puntos, te puedo ayudar a tiparlo mejor
// }

// interface MatchData {
//   team1: TeamData;
//   team2: TeamData;
//   currentSet: number;
//   sets: SetData[];
//   matchFinished: boolean;
// }

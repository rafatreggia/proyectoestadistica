"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Volleyball } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { VolleyballRadio } from "@/components/volleyballRadio";

type PointType =
  | "attack"
  | "serve"
  | "block"
  | "unForcedError"
  | "counterAttack"
  | "errorCounterAttack"
  | "errorAttack"
  | "errorServe";

interface PointLog {
  team: string;
  type: PointType;
  setNumber: number;
  score: {
    team1: number;
    team2: number;
  };
}

interface SetData {
  team1Points: number;
  team2Points: number;
  pointsLog: PointLog[];
}

interface Errors {
  unForcedError: number;
  errorCounterAttack: number;
  errorAttack: number;
  errorServe: number;
  totalErrors: number;
}

interface TeamData {
  name: string;
  sets: number;
  points: PointLog[];
  errors: Errors;
  pointsByType: any;
}

interface MatchData {
  team1: TeamData;
  team2: TeamData;
  currentSet: number;
  sets: SetData[];
  matchFinished: boolean;
}

const Page = () => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pointType, setPointType] = useState<PointType>("attack");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let initialData = localStorage.getItem("volleyballMatch");
    if (initialData) {
      setMatchData(JSON.parse(initialData));

      setLoading(false);
    } else {
      router.push("/");
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-4 border-yellow-400 rounded-full border-b-transparent animate-spin animation-delay-150"></div>
          </div>
          <span className="text-xl font-semibold text-blue-700">
            Cargando partido...
          </span>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <h1 className="flex items-center justify-center w-full h-screen font-semibold">
        Error al Caragar el partido
      </h1>
    );
  }
  if (matchData.matchFinished === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-4 border-yellow-400 rounded-full border-b-transparent animate-spin animation-delay-150"></div>
          </div>
          <span className="text-xl font-semibold text-blue-700">
            Partido Terminado: Redirigiendo...
          </span>
        </div>
      </div>
    );
  }

  const currentSet = matchData.sets[matchData.currentSet - 1];

  console.log(matchData);
  console.log(currentSet);

  const sumarPunto = (team: 1 | 2) => {
    console.log(team);
    console.log(pointType);

    //ver si existe matchData sino hacer un return para que no se rompa todo
    if (!matchData) {
      return;
    }
    //hacer una copia de cual es la data del partido y hacer una copia de la data del set actual
    let newMatchData = { ...matchData };
    console.log(newMatchData);
    let currentSetData = { ...currentSet };
    console.log(currentSetData);
    //determinar cual fue el equipo q hizo el punto
    let scoringTeam: "team1" | "team2" = team === 1 ? "team1" : "team2";
    let otherTeam: "team1" | "team2" = team === 1 ? "team2" : "team1";

    //al set actual sumarle 1 al que gana el set
    if (scoringTeam === "team1") {
      currentSetData.team1Points = currentSetData.team1Points + 1;
    } else {
      currentSetData.team2Points += 1;
    }
    console.log(currentSetData);
    //crear el pointLog y agregar ese pointLog
    let nameTeamPoint =
      scoringTeam === "team1"
        ? newMatchData.team1.name
        : newMatchData.team2.name;
    console.log(nameTeamPoint);
    let pointLog: PointLog = {
      team: nameTeamPoint,
      type: pointType,
      setNumber: newMatchData.currentSet,
      score: {
        team1: currentSetData.team1Points,
        team2: currentSetData.team2Points,
      },
    };
    currentSetData.pointsLog.push(pointLog);
    console.log(pointLog);
    console.log(currentSetData);
    //actualizar la informacion del set
    newMatchData.sets[newMatchData.currentSet - 1] = currentSetData;
    //actualizar las estadisticas para agregarle a cada equipo un punto mas
    newMatchData[scoringTeam].points.push(pointLog);
    newMatchData[scoringTeam].pointsByType[pointType] += 1;
    //agregar error si el punto fue error
    if (
      pointType === "unForcedError" ||
      pointType === "errorServe" ||
      pointType === "errorAttack" ||
      pointType === "errorCounterAttack"
    ) {
      newMatchData[otherTeam].errors.totalErrors += 1;
      newMatchData[otherTeam].errors[pointType] += 1;
    }
    //check si termino o no el set y si termino o no el partido
    let team1Points = currentSetData.team1Points;
    let team2Points = currentSetData.team2Points;
    let isSetFinished = false;
    if (team1Points >= 25 && team1Points - team2Points >= 2) {
      isSetFinished = true;
    }
    if (team2Points >= 25 && team2Points - team1Points >= 2) {
      isSetFinished = true;
    }
    //yo ahora lo que tengo que hacer es si van 2 set a 2 set y estamos en el 5to set
    if (newMatchData.currentSet === 5) {
      if (team1Points >= 15 && team1Points - team2Points >= 2) {
        isSetFinished = true;
      }
      if (team2Points >= 15 && team2Points - team1Points >= 2) {
        isSetFinished = true;
      }
    }
    if (isSetFinished === true) {
      if (team1Points > team2Points) {
        newMatchData.team1.sets += 1;
      } else {
        newMatchData.team2.sets += 1;
      }
      if (newMatchData.team1.sets === 3 || newMatchData.team2.sets === 3) {
        newMatchData.matchFinished = true;
        actualizarDatos(newMatchData);
        router.push("/resultados");
        return;
      } else {
        newMatchData.currentSet += 1;
        newMatchData.sets.push({
          team1Points: 0,
          team2Points: 0,
          pointsLog: [],
        });
        actualizarDatos(newMatchData);
      }
    } else {
      actualizarDatos(newMatchData);
    }

    console.log(matchData);
    //metodo para guardat los datos tanto en el useState como en el localStorage
  };

  const reiniciarPartido = () => {
    let datosInicialesDePartido = {
      team1: {
        name: matchData.team1.name,
        sets: 0,
        points: [],
        errors: {
          unForcedError: 0,
          errorCounterAttack: 0,
          errorAttack: 0,
          errorServe: 0,
          totalErrors: 0,
        },
        pointsByType: {
          attack: 0,
          serve: 0,
          block: 0,
          forcedError: 0,
          unforced: 0,
          unForcedError: 0,
          errorCounterAttack: 0,
          errorAttack: 0,
          errorServe: 0,
        },
      },
      team2: {
        name: matchData.team2.name,
        sets: 0,
        points: [],
        errors: {
          unForcedError: 0,
          errorCounterAttack: 0,
          errorAttack: 0,
          errorServe: 0,
          totalErrors: 0,
        },
        pointsByType: {
          attack: 0,
          serve: 0,
          block: 0,
          forcedError: 0,
          unforced: 0,
          unForcedError: 0,
          errorCounterAttack: 0,
          errorAttack: 0,
          errorServe: 0,
        },
      },
      currentSet: 1,
      sets: [{ team1Points: 0, team2Points: 0, pointsLog: [] }],
      matchFinished: false,
    };
    actualizarDatos(datosInicialesDePartido);
    setOpen(false);
  };
  let actualizarDatos = (nuevosDatos: MatchData) => {
    setMatchData(nuevosDatos);
    localStorage.setItem("volleyballMatch", JSON.stringify(nuevosDatos));
  };

  const traducirPunto = (tipo: PointType) => {
    switch (tipo) {
      case "attack":
        return "ataque";
      case "serve":
        return "saque";
      case "block":
        return "bloqueo";
      case "unForcedError":
        return "error no forzado";
      case "counterAttack":
        return "contra ataque";
      case "errorAttack":
        return "error de ataque";
      case "errorServe":
        return "error de saque";
      case "errorCounterAttack":
        return "error de contra ataque";
      default:
        return "Tipo de Punto no Definido";
    }
  };

  const restarPunto = () => {
    if (matchData.sets[0].pointsLog.length === 0) {
      return;
    }
    //preguntar si es el primer punto del set
    if (currentSet.pointsLog.length === 0) {
      //estamos ante el premier punto del set y tenemos que volver al set anterior
      let newMatchData = { ...matchData };
      newMatchData.sets.pop();
      let totalDeSet = newMatchData.sets.length;
      let currentSetData = newMatchData.sets[totalDeSet - 1];
      let largoDePointLog = currentSetData.pointsLog.length;
      let ultimoPunto = currentSetData.pointsLog[largoDePointLog - 1];
      currentSetData.pointsLog.pop();
      newMatchData.currentSet -= 1;

      //restar uno al equipo que se le sumo
      let nombreEquipo1 = matchData.team1.name;
      let nombreEquipo2 = matchData.team2.name;
      let numeroEquipoGanador = nombreEquipo1 === ultimoPunto.team ? 1 : 2;
      if (numeroEquipoGanador === 1) {
        currentSetData.team1Points -= 1;
        newMatchData.team1.sets -= 1;
      } else {
        currentSetData.team2Points -= 1;
        newMatchData.team2.sets -= 1;
      }
      // al equipo que sumo hay que restarle uno al tipo de punto q gano y quitar un elemnto de sus puntos
      if (numeroEquipoGanador === 1) {
        newMatchData.team1.points.pop();
        newMatchData.team1.pointsByType[ultimoPunto.type] -= 1;
      } else {
        newMatchData.team2.points.pop();
        newMatchData.team2.pointsByType[ultimoPunto.type] -= 1;
      }
      //el tipo de punto fue error al equipo congtrario le tenemos q restar uno donde se guardaban los errores
      if (
        ultimoPunto.type === "errorServe" ||
        ultimoPunto.type === "errorAttack" ||
        ultimoPunto.type === "errorCounterAttack" ||
        ultimoPunto.type === "unForcedError"
      ) {
        if (numeroEquipoGanador === 1) {
          newMatchData.team2.errors[ultimoPunto.type] -= 1;
          newMatchData.team2.errors.totalErrors -= 1;
        } else {
          newMatchData.team1.errors[ultimoPunto.type] -= 1;
          newMatchData.team1.errors.totalErrors -= 1;
        }
      }
      newMatchData.sets[newMatchData.currentSet - 1] = currentSetData;
      actualizarDatos(newMatchData);
    } else {
      let largoDePointLog = currentSet.pointsLog.length;
      let ultimoPunto = currentSet.pointsLog[largoDePointLog - 1];
      //copia de partido y una copia del ultimo set
      let newMatchData = { ...matchData };
      let currentSetData = { ...currentSet };

      // al ultimo set q le vamos a borrar un punto le tenemos que quitar
      currentSetData.pointsLog.pop();
      console.log(currentSetData.pointsLog);

      //restar uno al equipo que se le sumo
      let nombreEquipo1 = matchData.team1.name;
      let nombreEquipo2 = matchData.team2.name;
      let numeroEquipoGanador = nombreEquipo1 === ultimoPunto.team ? 1 : 2;
      if (numeroEquipoGanador === 1) {
        currentSetData.team1Points -= 1;
      } else {
        currentSetData.team2Points -= 1;
      }
      // al equipo que sumo hay que restarle uno al tipo de punto q gano y quitar un elemnto de sus puntos
      if (numeroEquipoGanador === 1) {
        newMatchData.team1.points.pop();
        newMatchData.team1.pointsByType[ultimoPunto.type] -= 1;
      } else {
        newMatchData.team2.points.pop();
        newMatchData.team2.pointsByType[ultimoPunto.type] -= 1;
      }
      //el tipo de punto fue error al equipo congtrario le tenemos q restar uno donde se guardaban los errores
      if (
        ultimoPunto.type === "errorServe" ||
        ultimoPunto.type === "errorAttack" ||
        ultimoPunto.type === "errorCounterAttack" ||
        ultimoPunto.type === "unForcedError"
      ) {
        if (numeroEquipoGanador === 1) {
          newMatchData.team2.errors[ultimoPunto.type] -= 1;
          newMatchData.team2.errors.totalErrors -= 1;
        } else {
          newMatchData.team1.errors[ultimoPunto.type] -= 1;
          newMatchData.team1.errors.totalErrors -= 1;
        }
      }
      newMatchData.sets[newMatchData.currentSet - 1] = currentSetData;
      actualizarDatos(newMatchData);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Volleyball className="h-8 w-8 text-blue-600" />
          <h1 className="text-center text-[36px] font-bold text-blue-800 tracking-tight capitalize">
            {matchData.team1.name} vs {matchData.team2.name}
          </h1>
          <Volleyball className="h-8 w-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-blue-600 text-white pb-3">
              <CardTitle className="text-center text-[28px] font-bold">
                Marcador
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-6 pb-4">
              <div className="flex justify-between items-center gap-10 sm:gap-20">
                <div className="text-center">
                  <h3 className="font-medium text-blue-800 capitalize">
                    {matchData.team1.name}
                  </h3>
                  <div className="text-[48px] font-bold text-blue-700 tabular-nums">
                    {currentSet.team1Points}
                  </div>
                  <div className="text-xl mt-1 bg-yellow-100 rounded-full px-3 py-1 font-semibold tabular-nums text-blue-700">
                    Sets: {matchData.team1.sets}
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-900">VS</div>
                <div className="text-center">
                  <h3 className="font-medium text-blue-800 capitalize">
                    {matchData.team2.name}
                  </h3>
                  <div className="text-[48px] font-bold text-blue-700 tabular-nums">
                    {currentSet.team2Points}
                  </div>
                  <div className="text-xl mt-1 bg-yellow-100 rounded-full px-3 py-1 font-semibold tabular-nums text-blue-700">
                    Sets: {matchData.team2.sets}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center bg-blue-50 py-3">
              <span className="font-semibold rounded-full border-2 border-yellow-300 px-4 py-1 bg-yellow-50 text-blue-700">
                Set {matchData.currentSet}
              </span>
            </CardFooter>
          </Card>

          {/* Point Scoring Card */}
          <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
            <CardHeader className="bg-blue-600 text-white pb-3">
              <CardTitle className="text-center text-[28px] font-bold">
                Anotar Punto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="pt-4 flex flex-wrap items-center justify-center">
                <RadioGroup
                  value={pointType}
                  className="flex gap-4 items-center justify-center flex-wrap"
                  onValueChange={(e: any) => {
                    setPointType(e);
                    console.log(e);
                  }}
                >
                  <div className="flex items-center flex-wrap gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm justify-center">
                    <VolleyballRadio
                      id="serve"
                      value="serve"
                      label="Saque"
                      isSelected={"serve" === pointType}
                    />
                    <VolleyballRadio
                      id="attack"
                      value="attack"
                      label="Ataque"
                      isSelected={"attack" === pointType}
                    />
                    <VolleyballRadio
                      id="counterAttack"
                      value="counterAttack"
                      label="Contra Ataq"
                      isSelected={"counterAttack" === pointType}
                    />
                    <VolleyballRadio
                      id="block"
                      value="block"
                      label="Bloqueo"
                      isSelected={"block" === pointType}
                    />
                    <VolleyballRadio
                      id="unForcedError"
                      value="unForcedError"
                      label="Error NF"
                      isSelected={"unForcedError" === pointType}
                    />
                    <VolleyballRadio
                      id="errorCounterAttack"
                      value="errorCounterAttack"
                      label="Error CA"
                      isSelected={"errorCounterAttack" === pointType}
                    />
                    <VolleyballRadio
                      id="errorAttack"
                      value="errorAttack"
                      label="Error A"
                      isSelected={"errorAttack" === pointType}
                    />
                    <VolleyballRadio
                      id="errorServe"
                      value="errorServe"
                      label="Error Saq"
                      isSelected={"errorServe" === pointType}
                    />
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center justify-center mt-5">
                <Button
                  variant="destructive"
                  onClick={() => {
                    restarPunto();
                  }}
                >
                  Deshacer Punto
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-blue-50 pt-4">
              <div className="w-full flex flex-wrap justify-around gap-4 ">
                <Button
                  onClick={() => {
                    sumarPunto(1);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-all hover:shadow-lg flex-1"
                >
                  Punto Para {matchData.team1.name}
                </Button>
                <Button
                  onClick={() => {
                    sumarPunto(2);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-all hover:shadow-lg flex-1"
                >
                  Punto Para {matchData.team2.name}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card className="border-2 border-blue-200 shadow-lg mb-6 overflow-hidden">
          <CardHeader className="bg-blue-600 text-white pb-3">
            <CardTitle className="text-[28px] font-bold">
              Historial de Puntos (Set Actual)
            </CardTitle>
            <CardDescription className="text-blue-100">
              Registro de todos los puntos anotados en este set
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-4">
            {currentSet?.pointsLog?.length > 0 ? (
              <div className="text-blue-700 text-center space-y-5 w-full max-h-[300px] overflow-y-scroll">
                {currentSet.pointsLog.slice().reverse().map((pointLog, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between w-full capitalize"
                    >
                      <span>{pointLog.team}</span>
                      <span>{traducirPunto(pointLog.type)}</span>
                      <span>
                        {pointLog.score.team1}-{pointLog.score.team2}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="min-h-[100px] bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-700 italic text-center">
                  No hay puntos registrados en este set
                </p>
                {/* Your point history would go here */}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-blue-50 py-3">
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Ver historial completo
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-5 bg-white p-4 rounded-lg border-2 border-blue-200 shadow-md">
          <Button
            variant="ghost"
            className="hover:bg-blue-100 text-blue-700 font-medium border border-blue-200"
          >
            Terminar Partido
          </Button>
          <Button
            onClick={() => {
              setOpen(!open);
            }}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Reiniciar Partido
          </Button>
        </div>
        <Tabs defaultValue="resumen" className="w-full mt-10">
          <TabsList className="w-full grid lg:grid-cols-3 grid-cols-1 mb-[10px] pb-[90px] lg:mb-0 lg:pb-0">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="team1" className="capitalize">
              Estadisticas: {matchData.team1.name}
            </TabsTrigger>
            <TabsTrigger value="team2" className="capitalize">
              Estadisticas: {matchData.team2.name}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="resumen">
            <Card>
              <CardHeader>
                <CardTitle className="text-[25px] text-blue-700">
                  Resumen Por Sets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-7">
                  {matchData.sets.map((set, index) => {
                    return (
                      <div
                        key={index}
                        className="space-y-3 border-b-2 pb-2 border-blue-500"
                      >
                        <h1 className="text-[15px]">Set {index + 1}</h1>
                        <div className="flex items-center justify-between capitalize text-[20px]">
                          <div>
                            <h2>{matchData.team1.name}</h2>
                            <h3 className=" flex gap-2 font-semibold text-[30px] py-2">
                              {set.team1Points}
                              {set.team1Points > set.team2Points && (
                                <img
                                  src="/images/pelota.webp"
                                  className="w-[45px]"
                                ></img>
                              )}
                            </h3>
                          </div>
                          <div className="flex flex-col justify-end items-end">
                            <h2>{matchData.team2.name}</h2>
                            <h3 className=" flex flex-row-reverse gap-2 font-semibold text-[30px] py-2">
                              {set.team2Points}
                              {set.team2Points > set.team1Points && (
                                <img
                                  src="/images/pelota.webp"
                                  className="w-[45px]"
                                ></img>
                              )}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team1">
            <Card>
              <CardHeader>
                <CardTitle className="text-[35px] text-blue-700">
                  Resumen{" "}
                  <span className="capitalize ">{matchData.team1.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-[25px] font-semibold">
                  Totales Ganados ✅: {matchData.team1.points.length} puntos
                </h1>
                <GraficoPuntos teamData={matchData.team1} />
                <h1 className="text-[25px] font-semibold mt-10 mb-10">
                  Total de Errores ❌: {matchData.team1.errors.totalErrors}{" "}
                  puntos
                </h1>
                <GraficoErrores teamData={matchData.team1} />

                {/* pointLOg[]<= con length le estoy pidiendo a JS cuantos elementos tiene ese arreglo */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[35px] text-blue-700">
                  Resumen{" "}
                  <span className="capitalize ">{matchData.team2.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-[25px] font-semibold">
                  Totales Ganados ✅: {matchData.team2.points.length} puntos
                </h1>
                <GraficoPuntos teamData={matchData.team2} />
                <h1 className="text-[25px] font-semibold mt-10 mb-10">
                  Total de Errores ❌: {matchData.team2.errors.totalErrors}{" "}
                  puntos
                </h1>
                <GraficoErrores teamData={matchData.team2} />

                {/* pointLOg[]<= con length le estoy pidiendo a JS cuantos elementos tiene ese arreglo */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500 mb-4">
              USTED ESTA POR REINICIAR EL PARTIDO
            </DialogTitle>
            <DialogDescription>
              ¿Esta seguro que desea REINICIAR el partido?
            </DialogDescription>
          </DialogHeader>
          <div className=" flex justify-between">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                reiniciarPartido();
              }}
              variant="destructive"
            >
              Reiniciar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;

const chartConfig = {
  pointType: {
    label: "Tipo de Punto",
    color: "#0067b1",
  },
} satisfies ChartConfig;

const GraficoPuntos = ({ teamData }: { teamData: TeamData }) => {
  console.log(teamData);
  const chartData = [
    { type: "Saque", pointType: teamData.pointsByType.serve },
    { type: "Ataque", pointType: teamData.pointsByType.attack },
    { type: "Bloqueo", pointType: teamData.pointsByType.block },
    { type: "Error NF", pointType: teamData.pointsByType.unForcedError },
    { type: "Contra Ataque", pointType: teamData.pointsByType.counterAttack },
    { type: "Error CA", pointType: teamData.pointsByType.errorCounterAttack },
    { type: "Error Ataque", pointType: teamData.pointsByType.errorAttack },
    { type: "Error Saque", pointType: teamData.pointsByType.errorServe },
  ];
  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="type"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // tickFormatter={(value) => value.slice(0, 6)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="pointType" fill="var(--color-pointType)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

const chartConfig2 = {
  pointType: {
    label: "Tipo de Error",
    color: "#ffe66d",
  },
} satisfies ChartConfig;

const GraficoErrores = ({ teamData }: { teamData: TeamData }) => {
  console.log(teamData);
  const chartData = [
    { type: "Error NF", pointType: teamData.errors.unForcedError },

    { type: "Error CA", pointType: teamData.errors.errorCounterAttack },
    { type: "Error Ataque", pointType: teamData.errors.errorAttack },
    { type: "Error Saque", pointType: teamData.errors.errorServe },
  ];
  return (
    <div>
      <ChartContainer config={chartConfig2}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="type"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // tickFormatter={(value) => value.slice(0, 6)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="pointType" fill="var(--color-pointType)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

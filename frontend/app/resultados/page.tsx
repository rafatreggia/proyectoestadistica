"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Volleyball } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

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
  pointsByType: Record<PointType, number>;
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
  const router = useRouter();

  useEffect(() => {
    let result = localStorage.getItem("volleyballMatch");
    if (result) {
      setMatchData(JSON.parse(result));
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
            Cargando resultados...
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

  console.log(matchData);
  const winner =
    matchData.team1.sets === 3 ? matchData.team1.name : matchData.team2.name;
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-center text-[36px] font-bold text-yellow-500 tracking-tight capitalize">
          Resultados del Partido
        </h1>
        <div className="flex items-center justify-center gap-3 mb-6">
          <Volleyball className="h-8 w-8 text-blue-600" />
          <h1 className="text-center text-[36px] font-bold text-blue-800 tracking-tight capitalize">
            {matchData.team1.name} vs {matchData.team2.name}
          </h1>
          <Volleyball className="h-8 w-8 text-blue-600" />
        </div>
        <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-600 text-white pb-3">
            <CardTitle className="text-center text-[28px] font-bold">
              Marcador
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
            <h1 className="font-medium text-blue-800 capitalize text-[20px] mb-5">
              Resultado Final
            </h1>
            <div className="flex justify-between items-center gap-10 sm:gap-20">
              <div className="text-center">
                <h3 className="font-medium text-blue-800 capitalize">
                  {matchData.team1.name}
                </h3>
                <div className="text-[48px] font-bold text-blue-700 tabular-nums">
                  {matchData.team1.sets}
                </div>
              </div>
              <div className="text-xl font-bold text-blue-900">VS</div>
              <div className="text-center">
                <h3 className="font-medium text-blue-800 capitalize">
                  {matchData.team2.name}
                </h3>
                <div className="text-[48px] font-bold text-blue-700 tabular-nums">
                  {matchData.team2.sets}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center bg-blue-50 py-3">
            <span className="font-semibold rounded-full border-2 border-yellow-300 px-4 py-1 bg-yellow-50 text-blue-700 capitalize">
              Ganador: {winner}
            </span>
          </CardFooter>
        </Card>
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
                  Total de Errores ❌: {matchData.team1.errors.totalErrors} puntos 
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
                  Total de Errores ❌: {matchData.team2.errors.totalErrors} puntos 
                </h1>
                <GraficoErrores teamData={matchData.team2} />

                {/* pointLOg[]<= con length le estoy pidiendo a JS cuantos elementos tiene ese arreglo */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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

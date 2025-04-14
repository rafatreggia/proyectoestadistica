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
import { Label } from "@/components/ui/label";

type PointType =
  | "attack"
  | "serve"
  | "block"
  | "unForcedError"
  | "counterAttack";

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

interface TeamData {
  name: string;
  sets: number;
  points: PointLog[];
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
  const [pointType, setPointType] = useState<PointType>("attack");
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

  const currentSet = matchData.sets[matchData.currentSet - 1];

  console.log(matchData);
  console.log(currentSet);
  const sumarPunto = (team: 1 | 2) => {
    console.log(team);
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
              <RadioGroup
                value={pointType}
                className="flex gap-4 items-center justify-center flex-wrap"
                onValueChange={(e: any) => {
                  setPointType(e);
                  console.log(e);
                }}
              >
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  
                  <RadioGroupItem
                    value="serve"
                    id="serve"
                    className="text-blue-600"
                  />
                  <Label htmlFor="serve" className="font-medium cursor-pointer">
                    Saque
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  <RadioGroupItem
                    value="attack"
                    id="attack"
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="attack"
                    className="font-medium cursor-pointer"
                  >
                    Ataque
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  <RadioGroupItem
                    value="counterAttack"
                    id="counterAttack"
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="counterAttack"
                    className="font-medium cursor-pointer"
                  >
                    Contra Ataque
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  <RadioGroupItem
                    value="block"
                    id="block"
                    className="text-blue-600"
                  />
                  <Label htmlFor="block" className="font-medium cursor-pointer">
                    Bloqueo
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                  <RadioGroupItem
                    value="unForcedError"
                    id="unForcedError"
                    className="text-blue-600"
                  />
                  <Label
                    htmlFor="unForcedError"
                    className="font-medium cursor-pointer"
                  >
                    Error NF
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="bg-blue-50 pt-4">
              <div className="w-full flex items-center justify-around gap-4">
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

        {/* Points History Card */}
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
            <div className="min-h-[100px] bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-700 italic text-center">
                No hay puntos registrados en este set
              </p>
              {/* Your point history would go here */}
            </div>
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
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            Reiniciar Partido
          </Button>
        </div>
      </div>
    </div>

    // <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    //   <div className="container mx-auto max-w-4xl">
    //     <h1 className="text-center text-[36px] font-bold capitalize">
    //       {matchData.team1.name} vs {matchData.team2.name}
    //     </h1>
    //     <div className="grid grid-cols-1  lg:grid-cols-2 gap-5 mt-5 mb-5">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="text-center text-[28px]">
    //             Marcador
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="flex items-center justify-center">
    //           <div className="flex justify-between items-center gap-20">
    //             <div className="text-center">
    //               <h3 className="font-medium">{matchData.team1.name}</h3>
    //               <div className="text-[40px] font-bold">
    //                 {currentSet.team1Points}
    //               </div>
    //               <div className="text-xl mt-2">{matchData.team1.sets}</div>
    //             </div>
    //             <div className="text-xl font-bold">-</div>
    //             <div className="text-center">
    //               <h3 className="font-medium">{matchData.team2.name}</h3>
    //               <div className="text-[40px] font-bold">
    //                 {currentSet.team2Points}
    //               </div>
    //               <div className="text-xl mt-2">{matchData.team2.sets}</div>
    //             </div>
    //           </div>
    //         </CardContent>
    //         <CardFooter className="flex items-center justify-center">
    //           <span className="font-semibold rounded-3xl border-[1px] border-gray-300 px-2 py-[1px] bg-gray-100">
    //             Set {matchData.currentSet}
    //           </span>
    //         </CardFooter>
    //       </Card>
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="text-center text-[28px]">
    //             Anotar Punto
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <RadioGroup
    //             value={pointType}
    //             className="flex gap-5 items-center justify-center flex-wrap"
    //             onValueChange={(e: any) => {
    //               setPointType(e);
    //               console.log(e);
    //             }}
    //           >
    //             <div className="flex items-center space-x-2">
    //               <RadioGroupItem value="serve" id="serve" />
    //               <Label htmlFor="serve">Saque</Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <RadioGroupItem value="attack" id="attack" />
    //               <Label htmlFor="attack">Ataque</Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <RadioGroupItem value="counterAttack" id="counterAttack" />
    //               <Label htmlFor="counterAttack">Contra Ataque</Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <RadioGroupItem value="block" id="block" />
    //               <Label htmlFor="block">Bloqueo</Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <RadioGroupItem value="unForcedError" id="unForcedError" />
    //               <Label htmlFor="unForcedError">Error NF</Label>
    //             </div>
    //           </RadioGroup>
    //         </CardContent>
    //         <CardFooter>
    //           <div className="w-full flex items-center justify-around">

    //             <Button onClick={()=>{sumarPunto(1)}}>Punto Para {matchData.team1.name}</Button>
    //             <Button onClick={()=>{sumarPunto(2)}}>Punto Para {matchData.team2.name}</Button>
    //           </div>
    //         </CardFooter>
    //       </Card>
    //     </div>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle className=" text-[28px]">
    //           Historial de Puntos (Set Actual)
    //         </CardTitle>
    //         <CardDescription>Card Description</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <p>Card Content</p>
    //       </CardContent>
    //       <CardFooter>
    //         <p>Card Footer</p>
    //       </CardFooter>
    //     </Card>
    //     <div className="flex items-center justify-between mt-5">
    //       <Button variant="ghost">Terminar Partido</Button>
    //       <Button variant="destructive">Reiniciar Partido</Button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Page;

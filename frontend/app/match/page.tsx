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
import { Loader2 } from "lucide-react";
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
        <span className="text-xl font-semibold text-blue-700">Cargando partido...</span>
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
  const sumarPunto = (team: 1|2 )=>{
    console.log(team)
  } 
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-center text-[36px] font-bold">
          {matchData.team1.name} vs {matchData.team2.name}
        </h1>
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-5 mt-5 mb-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-[28px]">
                Marcador
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="flex justify-between items-center gap-20">
                <div className="text-center">
                  <h3 className="font-medium">{matchData.team1.name}</h3>
                  <div className="text-[40px] font-bold">
                    {currentSet.team1Points}
                  </div>
                  <div className="text-xl mt-2">{matchData.team1.sets}</div>
                </div>
                <div className="text-xl font-bold">-</div>
                <div className="text-center">
                  <h3 className="font-medium">{matchData.team2.name}</h3>
                  <div className="text-[40px] font-bold">
                    {currentSet.team2Points}
                  </div>
                  <div className="text-xl mt-2">{matchData.team2.sets}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <span className="font-semibold rounded-3xl border-[1px] border-gray-300 px-2 py-[1px] bg-gray-100">
                Set {matchData.currentSet}
              </span>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-[28px]">
                Anotar Punto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={pointType}
                className="flex gap-5 items-center justify-center flex-wrap"
                onValueChange={(e: any) => {
                  setPointType(e);
                  console.log(e);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serve" id="serve" />
                  <Label htmlFor="serve">Saque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attack" id="attack" />
                  <Label htmlFor="attack">Ataque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="counterAttack" id="counterAttack" />
                  <Label htmlFor="counterAttack">Contra Ataque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="block" id="block" />
                  <Label htmlFor="block">Bloqueo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unForcedError" id="unForcedError" />
                  <Label htmlFor="unForcedError">Error NF</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-around">
                
                <Button onClick={()=>{sumarPunto(1)}}>Punto Para {matchData.team1.name}</Button>
                <Button onClick={()=>{sumarPunto(2)}}>Punto Para {matchData.team2.name}</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className=" text-[28px]">
              Historial de Puntos (Set Actual)
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost">Terminar Partido</Button>
          <Button variant="destructive">Reiniciar Partido</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;

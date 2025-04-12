"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
export default function Home() {
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");

  const router = useRouter();

  const handleClick = () => {
    if (team1 === "") {
      toast("Debe ingresar el nombre del Equipo 1");
      return;
    }
    if (team2 === "") {
      toast("Debe ingresar el nombre del Equipo 2");
      return;
    }
    //asi guardo datos en el navegador
    // localStorage.setItem(
    //   "test1",
    //   JSON.stringify({ team1: team1, team2: team2 })
    // );
    // let info = localStorage.getItem("test1");
    // if (info) {
    //   info = JSON.parse(info);
    //   console.log(info)
    // }

    let datosInicialesDePartido = {
      team1: {
        name: team1,
        sets: 0,
        points: [],
        pointsByType: {
          attack: 0,
          serve: 0,
          block: 0,
          forcedError: 0,
          unforced: 0,
        },
      },
      team2: {
        name: team2,
        sets: 0,
        points: [],
        pointsByType: {
          attack: 0,
          serve: 0,
          block: 0,
          forcedError: 0,
          unforced: 0,
        },
      },
      currentSet: 1,
      sets: [{ team1Points: 0, team2Points: 0, pointsLog: [] }],
      matchFinished: false,
    };
    localStorage.setItem(
      "volleyballMatch",
      JSON.stringify(datosInicialesDePartido)
    );
    router.push("/match");
  };
  return (
    <div className="w-full h-screen bg-gray-50 p-10 flex flex-col items-center justify-center relative">
      {/* <img src="/images/pelota.webp" alt="imagen de pleota" className="w-full h-screen absolute z-2"/> */}
      <Card className="z-10">
        <CardHeader className="text-center">
          <CardTitle>Vollleyball Scorer</CardTitle>
          <CardDescription>
            Ingresa los nombres de los equipops para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Equipo 1</Label>
            <Input
              placeholder="Nombre delEquipo 1"
              value={team1}
              onChange={(e) => {
                setTeam1(e.target.value);
              }}
            ></Input>
          </div>
          <div>
            <Label>Equipo 2</Label>
            <Input
              placeholder="Nombre delEquipo 2"
              value={team2}
              onChange={(e) => {
                setTeam2(e.target.value);
              }}
            ></Input>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button
            className="w-full"
            onClick={() => {
              handleClick();
            }}
          >
            Comenzar Partido
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

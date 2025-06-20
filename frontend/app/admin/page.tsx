"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { getAllClubs, validateSessionAdmin } from "../actions/admin";
import Link from "next/link";
import { IClub } from "@/models/Club";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    let response = await getAllClubs();
    if (!response.ok) {
      setLoading(false);
      setError(response?.message as string);
      return;
    }
    setLoading(false);
    setClubs(response?.clubs as IClub[]);
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <h1>Cargando Clubs</h1>;
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <div>
      <div className="w-full flex">
        <h1>Clubes</h1>
        <Link href={"/admin/registrar-club"}>
          <Button>Registrar Club</Button>
        </Link>
      </div>
      {clubs.length === 0 ? (
        "No Hay Clubes Ingresados"
      ) : (
        <>
          {clubs.map((club, index) => {
            return (
              <div key={club._id}>
                <h1>{club.name}</h1>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Page;

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IAdmin } from "@/lib/types";
import React, { useState } from "react";
import { loginAdmin } from "../actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { createAdmin } from "../actions/admin";

const Page = () => {
  const [user, setUser] = useState<IAdmin>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(user);
    let response = await loginAdmin(user.email, user.password);
    if (!response.ok) {
      toast(response.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-yellow-400 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-blue-900 text-center">
          Ingreso de Administrador
        </h2>

        <div>
          <Label className="text-blue-900">Email</Label>
          <Input
            required
            value={user.email}
            placeholder="Ingrese su Email"
            className="mt-1 border-blue-900 focus:ring-yellow-400 focus:border-yellow-400"
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
        </div>

        <div>
          <Label className="text-blue-900">Contraseña</Label>
          <Input
            type="password"
            value={user.password}
            placeholder="Ingrese su Contraseña"
            className="mt-1 border-blue-900 focus:ring-yellow-400 focus:border-yellow-400"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold"
          disabled={loading}
        >
          {loading === true ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </div>
  );
};

export default Page;

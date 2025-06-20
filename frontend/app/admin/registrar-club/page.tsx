"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { countries, getCountry, ICountry } from "@/lib/countries";
import { IClub } from "@/models/Club";
import React, { useState } from "react";

const Page = () => {
  const [step, setStep] = useState<number>(1);
  const [nuevoClub, setNuevoClub] = useState<IClub>({
    name: "",
    email: "",
    phone: "",
    location: { city: "", country: "ARG", address: "" },
    subscription: {
      isActive: false,
      startDate: "",
      endDate: "",
      trial: {
        isTrial: false,
        startDate: "",
        endDate: "",
      },
      plan: {
        maxUsers: 2,
        enableStats: false,
        enableClassProjections: false,
      },
      lastPaymentDate: "",
      paymentStatus: "pending",
    },
  });
  return (
    <div>
      <h1>Registrar Nuevo Club</h1>
      {step === 1 && (
        <Step1
          step={step}
          nuevoClub={nuevoClub}
          setStep={setStep}
          setNuevoClub={setNuevoClub}
        ></Step1>
      )}
      {step === 2 && (
        <Step2
          step={step}
          nuevoClub={nuevoClub}
          setStep={setStep}
          setNuevoClub={setNuevoClub}
        ></Step2>
      )}
      {step === 3 && (
        <Step3
          step={step}
          nuevoClub={nuevoClub}
          setStep={setStep}
          setNuevoClub={setNuevoClub}
        ></Step3>
      )}
    </div>
  );
};

export default Page;

interface StepProps {
  step: number;
  setStep: any;
  nuevoClub: IClub;
  setNuevoClub: any;
}

const Step1 = ({ step, setStep, nuevoClub, setNuevoClub }: StepProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(step + 1);
  };
  return (
    <div>
      <h1>Primer Paso</h1>
      <form onSubmit={handleSubmit}>
        <Label>Nombre del Club</Label>
        <Input
          placeholder="Ingrese su Club"
          value={nuevoClub.name}
          onChange={(e) => {
            setNuevoClub({ ...nuevoClub, name: e.target.value });
          }}
          required
        ></Input>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Ingrese su Email"
          value={nuevoClub.email}
          onChange={(e) => {
            setNuevoClub({ ...nuevoClub, email: e.target.value });
          }}
          required
        ></Input>
        <Label>Telefono</Label>
        <Input
          placeholder="Ingrese su Telefono"
          value={nuevoClub.phone}
          onChange={(e) => {
            setNuevoClub({ ...nuevoClub, phone: e.target.value });
          }}
          required
        ></Input>

        <Button type="submit">Continuar</Button>
      </form>
    </div>
  );
};
const Step2 = ({ step, setStep, nuevoClub, setNuevoClub }: StepProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(step + 1);
  };
  return (
    <div>
      <h1>Segundo Paso</h1>
      <form onSubmit={handleSubmit}>
        <Label>Seleccione un Pais</Label>
        <Select
          required
          value={nuevoClub?.location?.country}
          defaultValue={nuevoClub?.location?.country}
          onValueChange={(e) => {
            setNuevoClub({
              ...nuevoClub,
              location: { ...nuevoClub.location, country: e },
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pais" />
          </SelectTrigger>
          <SelectContent>
            {countries?.map((country: ICountry, index: any) => (
              <SelectItem value={country.code} key={country.code}>
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={country.flag}
                    alt="País"
                    className="w-[15px] h-[10px]"
                  />
                  {country.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label>Ciudad</Label>
        <Input
          required
          placeholder="Ingrese su Ciudad"
          value={nuevoClub.location?.city}
          onChange={(e) => {
            setNuevoClub({
              ...nuevoClub,
              location: { ...nuevoClub.location, city: e.target.value },
            });
          }}
        ></Input>
        <Label>Direccion</Label>
        <Input
          required
          placeholder="Ingrese su Direccion"
          value={nuevoClub.location?.address}
          onChange={(e) => {
            setNuevoClub({
              ...nuevoClub,
              location: { ...nuevoClub.location, address: e.target.value },
            });
          }}
        ></Input>

        <Button
          type="button"
          onClick={() => {
            setStep(step - 1);
          }}
        >
          Volver
        </Button>
        <Button type="submit">Continuar</Button>
      </form>
    </div>
  );
};
const Step3 = ({ step, setStep, nuevoClub, setNuevoClub }: StepProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(nuevoClub);
  };
  return (
    <div>
      <h1>Tercer Paso</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={nuevoClub.subscription?.isActive}
            onCheckedChange={(e) => {
              setNuevoClub({
                ...nuevoClub,
                subscription: { ...nuevoClub.subscription, isActive: e },
              });
            }}
          />
          <Label htmlFor="airplane-mode">
            {nuevoClub.subscription?.isActive === false
              ? "Suscripcion Desactivada"
              : "Suscripcion Activada"}
          </Label>
        </div>

        <Button
          type="button"
          onClick={() => {
            setStep(step - 1);
          }}
        >
          Volver
        </Button>
        <Button type="submit">Finalizar</Button>
      </form>
    </div>
  );
};

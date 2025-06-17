"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { validateSessionAdmin } from "../actions/admin";

const Page = () => {
  const handleClick = async () => {
    await validateSessionAdmin();
  };
  return (
    <div>
      <Button onClick={handleClick}>Probar</Button>
    </div>
  );
};

export default Page;

import React from "react";
import { Link } from "expo-router";
import Button from "@/components/button";

const HeaderSettingsBtn = () => {
  return (
    <Link href="/settings" asChild>
      <Button variant="ghost" size="icon" leftIcon="gear" />
    </Link>
  );
};

export default HeaderSettingsBtn;

import { supabase } from "@/lib/supabase";
import React from "react";
import { Button, Text } from "@/components/themed";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }
}

export default function SignOutButton() {
  return (
    <Button onPress={onSignOutButtonPress}>
      <Text>Sign out</Text>
    </Button>
  );
}

"use client";
import { UserContext } from "@/hooks/useProfile";
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;

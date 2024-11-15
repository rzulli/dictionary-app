"use client";
import LoginForm from "@/components/forms/loginForm";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ProfileContext } from "@/context/profile/ProfileContext";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4).max(15),
});

interface LoginProps {
  redirectUrl?: string;
}
export default function Login({ redirectUrl }: LoginProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = form;

  const router = useRouter();
  const { data: session } = useSession();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (res.ok) {
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        setError("root", { message: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Erro interno" });
    }
  };
  return (
    <>
      {session?.user && (
        <div className="text-lg text-center">
          Você já está logado.
          <div className="flex gap-5 items-center justify-center mt-5">
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
            >
              Log out
            </Button>{" "}
            <Button onClick={() => redirect("/profile")} variant="secondary">
              Profile
            </Button>
          </div>
        </div>
      )}
      {!session && (
        <>
          <div className="text-3xl my-4 text-center">Login</div>

          <LoginForm
            onSubmit={handleSubmit(onSubmit, () => alert("aaaa"))}
            form={form}
          />
        </>
      )}
    </>
  );
}

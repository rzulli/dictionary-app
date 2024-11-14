"use client";
import LoginForm from "@/components/local/loginForm";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import RegisterForm from "@/components/local/registerForm";

const formSchema = z
  .object({
    name: z.string().min(3).max(20),
    email: z.string().email("Email inválido"),
    password: z.string().min(4).max(15),
    confirmPassword: z.string().min(4).max(15),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Senha e confirmação não são iguais",
        path: ["confirmPassword"],
      });
    }
  });

interface RegisterProps {
  redirectUrl?: string;
}
export default function Register({ redirectUrl }: RegisterProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(async (res) => {
        console.log(res);
        if (res.ok) {
          await signIn("credentials", {
            redirect: true,
            callbackUrl: "/profile",
            email: values.email,
            password: values.password,
          });
        } else {
          const data = await res.json();
          console.log(data);
          setError("root", {
            message: data.message,
          });
        }
      });
    } catch (error) {
      console.error("Register error:", error);
      setError("root", { message: "Erro interno" });
    }
  }
  return (
    <>
      <span className="text-xl">Register</span>

      <RegisterForm handleSubmit={handleSubmit(onSubmit)} form={form} />
    </>
  );
}

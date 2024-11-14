"use client";
import LoginForm from "@/components/local/loginForm";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
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
function Errors(props: { errors?: string[] }) {
  if (!props.errors?.length) return null;
  return (
    <div>
      {props.errors.map((err) => (
        <p>{err}</p>
      ))}
    </div>
  );
}
export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      }).then(({ ok, error }) => {
        console.log(ok, error);
        if (ok) {
          router.push("/profile");
        } else {
          setError("root", {
            type: "400",
            message: error,
          });
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Erro interno" });
    }
  }
  return (
    <>
      <Errors errors={errors.root} />
      <LoginForm handleSubmit={handleSubmit(onSubmit)} form={form} />
    </>
  );
}

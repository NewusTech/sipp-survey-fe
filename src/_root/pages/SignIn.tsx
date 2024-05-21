import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email minimal harus 2 karakter.",
  }),
  password: z.string().min(8, {
    message: "password harus 8 karakter",
  }),
});

const SignIn = () => {
  useEffect(() => {
    document.title = "Login - SIPPP";
  }, []);
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const auth = "auth/login";

    axios
      .post(`${apiUrl}/${auth}`, {
        email: values.email,
        password: values.password,
      })
      .then((response) => {
        // Jika autentikasi berhasil, simpan token dalam cookies
        const token = response.data.data.token;
        const name = response.data.data.nama;
        const email = response.data.data.email;
        const id = response.data.data.id;
        const photo = response.data.data.photo;

        Cookies.set("adsxcl", token);
        Cookies.set("name", name);
        Cookies.set("email", email);
        Cookies.set("id", id);
        Cookies.set("photo", photo);
        window.location.reload();
        navigate("/dashboard");
        localStorage.setItem("loginSuccessToast", "Login berhasil.");
      })
      .catch((error) => {
        // Tambahkan penanganan pesan kesalahan yang lebih spesifik
        if (error.response && error.response.status === 401) {
          toast("Username atau password salah. Silakan coba lagi.");
        } else {
          toast("Login gagal. Terjadi kesalahan pada server.");
        }
        console.log(error);
      });
  }

  return (
    <div className="bg-abu-2 w-screen h-screen p-4 md:p-0">
      <div className="flex">
        <div className="md:w-full md:block hidden">
          <img
            src="/assets/images/banner.png"
            alt="banner"
            className="w-screen h-screen"
          />
        </div>
        <div className="w-screen md:w-full h-screen flex flex-col items-center justify-center">
          <div className="w-16 h-16 md:mb-3 mb-6">
            <img src="/assets/images/logo.jpg" alt="logo" />
          </div>
          <h1 className="text-[30px] md:text-[38px] text-center uppercase text-biru font-semibold">
            survey kondisi
          </h1>
          <h3 className="text-biru text-xs text-center w-[300px] md:w-[350px] uppercase font-light tracking-widest -mt-1 mb-14">
            Dinas Pekerjaan Umum Dan Penataan Ruang Tulang Bawang Barat
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormControl>
                        <Input
                          placeholder="email"
                          type="email"
                          className="bg-transparent border-b border-b-gray-300 focus-visible:border-b-biru rounded-none w-96"
                          {...field}
                        />
                      </FormControl>
                      <img
                        src="/assets/icons/user.svg"
                        alt="username"
                        className="z-10 -ml-7"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          className="bg-transparent w-96 border-b border-b-gray-300 focus-visible:border-b-biru rounded-none"
                          {...field}
                        />
                      </FormControl>
                      <img
                        src="/assets/icons/key.svg"
                        alt="username"
                        className="z-10 -ml-7"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center pt-8">
                <Button
                  type="submit"
                  className="rounded-full bg-biru hover:bg-biru-2 px-28 uppercase tracking-widest"
                >
                  login
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

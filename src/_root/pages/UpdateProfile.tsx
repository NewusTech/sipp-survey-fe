import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";
// import FileUploader from "@/components/shared/FIleUploader.tsx";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  // file: z.custom<File[]>(),
});

const UpdateUser = () => {
  const name = Cookies.get("name");
  const email = Cookies.get("email");
  const id = Cookies.get("id");
  // const photo = Cookies.get("photo");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
    },
  });

  const token = Cookies.get("adsxcl");

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const updateUser = `user/update/${id}`;

    const postData = {
      nama: values.name,
      email: values.email,
      // photo: values.file[0],
    };

    axios
      .post(`${apiUrl}/${updateUser}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast("User updated successfully", response.data.data.nama);
      })
      .catch((error) => {
        toast("Error updating user: ", error);
        console.log(error);
      });
  }

  return (
    <section className="bg-abu-2 w-screen h-[600px]">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto mt-10">
          <h1 className="ml-6 text-gray-400 text-xl font-medium">
            Update User
          </h1>
          <div className="w-full h-[350px] bg-white rounded-lg mt-6">
            <div className="flex flex-col items-center justify-center py-10 px-10 md:px-32">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-9 w-full max-w-5xl"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="border-b"
                            placeholder="masukkan nama"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="border-b"
                            placeholder="masukkan email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name="file"*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem>*/}
                  {/*      <FormLabel>Add Photos</FormLabel>*/}
                  {/*      <FormControl>*/}
                  {/*        <FileUploader*/}
                  {/*          fileChange={field.onChange}*/}
                  {/*          mediaUrl={photo}*/}
                  {/*        />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  <div className="flex gap-4 items-center justify-end">
                    <Button
                      type="submit"
                      className="bg-biru hover:bg-biru-2 font-light"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateUser;

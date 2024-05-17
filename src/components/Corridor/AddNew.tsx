import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

const corridorSchema = z.object({
  name: z.string().min(5).max(50),
});

const AddNew = ({ refreshCorridors }: { refreshCorridors: () => void }) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof corridorSchema>>({
    resolver: zodResolver(corridorSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof corridorSchema>) {
    const token = Cookies.get("adsxcl");

    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const createCorridor = "koridor/master_koridor";

    axios
      .post(
        `${apiUrl}/${createCorridor}`,
        {
          name: values.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        const data = response.data.message;
        toast(data);
        refreshCorridors();
      })
      .catch((error) => {
        toast(error.message);
      });
  }
  return (
    <div className="w-full mb-20">
      <h1 className="text-gray-400 text-2xl">Add New</h1>
      <div className="w-full h-full md:h-[393px] bg-white p-5 rounded-2xl mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col justify-between h-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-10 mx-5">
                  <FormLabel>Koridor</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-full border-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 mx-5">
              <Button
                type="submit"
                className="rounded-full bg-biru w-full hover:bg-biru-2 text-xl font-light"
              >
                simpan
              </Button>
              <Button className="rounded-full bg-pink w-full hover:bg-pink-2 text-xl font-light">
                batal
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddNew;

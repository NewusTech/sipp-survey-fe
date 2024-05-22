import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

const fileSchema = z.custom((value) => {
  // Pastikan nilai yang diberikan adalah objek File atau FileList
  if (!(value instanceof File) && !(value instanceof FileList)) {
    toast("File harus berupa objek File atau FileList");
  }

  // Jika nilai adalah FileList, pastikan setidaknya ada satu file
  if (value instanceof FileList && value.length === 0) {
    toast("Minimal satu file harus dipilih");
  }

  // Validasi ekstensi file (opsional)
  const allowedExtensions = [".xls", ".xlsx"];
  const files: any = value instanceof FileList ? Array.from(value) : [value];

  for (const file of files) {
    const fileExtension =
      (file.name ?? "").split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExtensions.includes("." + fileExtension)) {
      toast("File harus memiliki ekstensi .xls atau .xlsx");
    }
  }

  return true;
});

const formSchema = z.object({
  excelFile: fileSchema,
});

const ImportRoadSection = () => {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const downloadTemplate = "template/survey-jalan.xlsx";
  const importRuasJalan = "import/ruas_jalan";
  const token = Cookies.get("adsxcl");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(
        `${apiUrl}/${importRuasJalan}`,
        {
          file: values.excelFile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        toast(response.data.message);
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast(error.response.data.message);
      });
  }

  const handleDownloadTemplate = () => {
    axios
      .get(`${apiUrl}/${downloadTemplate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        window.location.href = response.data.download_url;
        toast("Berhasil Download");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <DialogContent className="h-[300px] w-full md:w-[500px]">
      <DialogHeader>
        <DialogTitle>Import Data Ruas Jalan</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        <div className="flex justify-end">
          <Button
            className="bg-white border text-black hover:bg-slate-50"
            type="button"
            onClick={handleDownloadTemplate}
          >
            Download Format Import
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="excelFile"
              render={({ field: { onChange }, ...field }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input File Excel"
                      type="file"
                      {...field}
                      onChange={(event) => {
                        if (!event.target.files) return;
                        onChange(event.target.files[0]);
                      }}
                      className="border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-biru hover:bg-biru-2">
              Import
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ImportRoadSection;

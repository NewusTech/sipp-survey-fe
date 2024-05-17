import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const BridgeDetail = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detail Jembatan</DialogTitle>
      </DialogHeader>
      <div className="flex gap-10">
        <div className="flex justify-between items-center w-full">
          <div>No Ruas</div>
          <div>Sungai Musi</div>
        </div>
        <div className="flex justify-between items-center w-full gap-2">
          <div>Nama Ruas</div>
          <div>Sungai Musi</div>
        </div>
      </div>
    </DialogContent>
  );
};

export default BridgeDetail;

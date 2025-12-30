import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  correctPassword?: string;
}

export function PasswordModal({ isOpen, onClose, onSuccess, title, correctPassword }: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      toast.success("密码正确");
      onSuccess();
      onClose();
      setPassword("");
    } else {
      toast.error("密码错误，请重试");
      setPassword("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#fdfbf7] border-[#5c4033] border-2 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-[#2c1810]">
            请输入【{title}】保险柜的密码
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#fdfbf7] border-[#5c4033] text-[#2c1810] placeholder:text-[#8a6d5b] focus-visible:ring-[#a67c52]"
              autoFocus
            />
          </div>
          <div className="flex justify-center pt-2">
            <Button 
              type="submit"
              className="bg-[#5c4033] hover:bg-[#3d2b1f] text-[#fdfbf7] font-serif px-8"
            >
              确认
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

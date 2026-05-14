"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Package,
  Mail,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: "",
    imageFile: null as File | null,
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setForm({
        name: res.data.name || "",
        image: res.data.image || "",
        imageFile: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      } else if (form.image) {
        formData.append("image", form.image);
      }

      const res = await api.put("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 my-12 space-y-10">

      <div>
          <h1 className="text-3xl font-extrabold mt-5">{user?.name} Profile</h1>
        <p className="text-slate-500">
          Manage your personal information and store identity.
        </p>
      </div>

      <div className="bg-white border rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm">
   
        <Avatar className="h-32 w-32 md:h-40 md:w-40 border">
          <AvatarImage
            src={user?.image || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>


        <div className="flex-1 space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              icon={<UserCircle className="w-4 h-4" />}
              label="Display Name"
              value={user?.name}
            />

            <InfoItem
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={user?.email}
            />

            <InfoItem
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Role"
              value={user?.role}
              color="text-emerald-600"
            />

            <InfoItem
              icon={<Package className="w-4 h-4" />}
              label="Products"
              value={user?.productCount}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black text-white rounded-xl">
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogDescription>
                  Update your vendor information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setForm({ ...form, imageFile: file });
                      }
                    }}
                  />
                  {form.imageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {form.imageFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Or Image URL</Label>
                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value, imageFile: null })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    
    </div>
  );
};

function InfoItem({ icon, label, value, color = "text-slate-700" }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        {icon}
        {label}
      </div>
      <p className={`font-bold ${color}`}>{value || "Not set"}</p>
    </div>
  );
}

export default Profile;
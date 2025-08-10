import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Menu, SearchIcon, User, UserPlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const profileSchema = z.object({
  name: z.string().min(3, "Name is required").max(32, "Name is too long"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const SidebarHeader = ({ onAddChatClick }: { onAddChatClick: () => void; }) => {
  const { user, logout, updateUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: { name: user?.name || "" }
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (isProfileOpen && user) {
      reset({ name: user.name });
      setAvatarPreview(null);
      setSelectedAvatar(null);
    }
  }, [isProfileOpen, user, reset]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }

    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDeleteAvatar = async () => {
    if (!user || !user.avatar) return;

    setIsDeleting(true);
    try {
      await api.delete(`/users/${user.id}/avatar`);
      
      updateUser({
        ...user,
        avatar: null,
      });
      
      setAvatarPreview(null);
      setSelectedAvatar(null);
    } catch (err) {
      console.error("Failed to delete avatar", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    const nameChanged = watchedName !== user.name;
    const avatarChanged = !!selectedAvatar;

    if (!nameChanged && !avatarChanged) {
      setIsProfileOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (nameChanged) {
        formData.append("name", data.name);
      }
      if (selectedAvatar instanceof File) {
        formData.append("avatar", selectedAvatar);
      }

      const response = await api.post(`/users/${user.id}`, formData);

      const newAvatarData = response.data.avatar;
      if (avatarChanged && newAvatarData) {
        const timestamp = new Date().getTime();
        newAvatarData.original = `${newAvatarData.original}?t=${timestamp}`;
        newAvatarData.medium = `${newAvatarData.medium}?t=${timestamp}`;
        newAvatarData.small = `${newAvatarData.small}?t=${timestamp}`;
      }

      updateUser({
        ...user,
        name: nameChanged ? data.name : user.name,
        avatar: newAvatarData || user.avatar,
      });

      setIsProfileOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user?.avatar?.small || "/placeholder.svg"} />
            {/* <AvatarImage
              src={user?.avatar?.small ? `${user.avatar.small}?${new Date().getTime()}` : "/placeholder.svg"}
            /> */}
            <AvatarFallback className="bg-rose-600 text-white">
              {user?.name
                .split(" ")
                .filter((n) => n.length > 0)
                .map((n) => n[0].toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-semibold truncate">{user?.name}</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-zinc-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onAddChatClick}
          >
            <UserPlusIcon size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Menu size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 border-zinc-700"
            >
              <DropdownMenuItem
                onClick={() => setIsProfileOpen(true)}
                className="text-zinc-200 hover:bg-zinc-800 focus:bg-zinc-800 hover:text-white focus:text-white cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-zinc-200 hover:bg-zinc-800 focus:bg-zinc-800 hover:text-white focus:text-white cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 flex-shrink-0"
          size={18}
        />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500"
        />
      </div>

      {/* Profile Dialog */}
      <Dialog
        open={isProfileOpen}
        onOpenChange={(open) => {
          if (!open) setIsProfileOpen(false);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[425px] bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update your name and avatar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  {avatarPreview ? (
                    <AvatarImage
                      src={avatarPreview}
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <AvatarImage src={user?.avatar?.small || ""} />
                      <AvatarFallback className="bg-rose-600 text-white text-xl">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                    type="button"
                    disabled={!user?.avatar || isDeleting}
                    onClick={handleDeleteAvatar}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                    type="button"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    Change
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-200">
                  Name
                </Label>
                <Input
                  id="name"
                  className={`bg-zinc-800 border-zinc-700 text-zinc-200 ${errors.name ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileOpen(false)}
                className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={(watchedName === user?.name && !selectedAvatar) || !isValid || isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

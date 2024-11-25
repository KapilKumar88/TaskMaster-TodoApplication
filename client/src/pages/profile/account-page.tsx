import * as React from "react";
import { CameraIcon, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api/user/user-api-slice";
import { getInitials } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
  const { data: userProfile } = useFetchUserProfileQuery({});
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [notificationLoadingState, setNotificationLoadingState] =
    React.useState<boolean>(false);
  const [passwordChangeLoadingState, setPasswordChangeLoadingState] =
    React.useState<boolean>(false);
  const [changePasswordState, setChangePasswordState] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [name, setName] = React.useState<string>(userProfile?.name ?? "");
  const [passwordError, setPasswordError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updatePassword = async () => {
    setPasswordChangeLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("current_password", changePasswordState.currentPassword);
      formData.append("password", changePasswordState.newPassword);
      formData.append("confirm_password", changePasswordState.confirmPassword);
      const response = await updateUserProfile(formData).unwrap();

      if (response.status) {
        setChangePasswordState({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.message ?? "Something went wrong.Pleas try again",
        });
      }
    } catch (error: any) {
      toast({
        title: "error",
        description:
          error?.message ||
          error?.data?.message ||
          "Something went wrong. Please try again",
      });
    }
    setPasswordChangeLoadingState(false);
  };

  const updateProfilePicture = async () => {
    if (fileInputRef.current === null) {
      toast({
        title: "error",
        description: "File input is null",
      });
      return;
    }

    if (fileInputRef.current.files === null) {
      toast({
        title: "error",
        description: "No file selected",
      });
      return;
    }

    if (fileInputRef.current.files[0] === null) {
      toast({
        title: "error",
        description: "No file selected",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", fileInputRef.current.files[0]);
      const response = await updateUserProfile(formData).unwrap();
      if (response.status) {
        fileInputRef.current.value = "";
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.message ?? "Something went wrong.Pleas try again",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          (error?.message || error?.data?.message) ??
          "Something went wrong. Please try again",
      });
    }
  };

  const updateUserDetails = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      const response = await updateUserProfile(formData).unwrap();

      if (response.status) {
        setName("");
        setIsEditing(false);
        toast({
          title: "Success",
          description: response?.message ?? "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.message ?? "Something went wrong.Pleas try again",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
  };

  const updateNotificationStatus = async (payload: {
    emailNotification: boolean;
    pushNotification: boolean;
  }) => {
    setNotificationLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("email_notification", payload.emailNotification);
      formData.append("push_notification", payload.pushNotification);
      const response = await updateUserProfile(formData).unwrap();

      if (response.status) {
        setName("");
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Notification status updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.message ?? "Something went wrong.Pleas try again",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
    setNotificationLoadingState(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your public profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profileImage} alt="User" />
              <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-picture-input"
              ref={fileInputRef}
              onChange={updateProfilePicture}
            />
            <label htmlFor="profile-picture-input">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </label>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  defaultValue={userProfile?.name}
                  readOnly={!isEditing}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={userProfile?.email}
                  readOnly
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <Button onClick={updateUserDetails}>
              Save Changes
              {isLoading && <Loader className="ml-2 animate-spin" />}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(!isEditing)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your notification and privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={userProfile?.notification.emailNotification}
                onCheckedChange={() =>
                  updateNotificationStatus({
                    emailNotification:
                      !userProfile?.notification.emailNotification,
                    pushNotification:
                      userProfile?.notification.pushNotification,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              {!notificationLoadingState && (
                <Switch
                  id="push-notifications"
                  checked={userProfile?.notification.pushNotification}
                  onCheckedChange={() =>
                    updateNotificationStatus({
                      emailNotification:
                        userProfile?.notification.emailNotification,
                      pushNotification:
                        !userProfile?.notification.pushNotification,
                    })
                  }
                />
              )}
              {notificationLoadingState && (
                <Loader className="ml-2 animate-spin" />
              )}
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Changes Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={changePasswordState.currentPassword}
                  onChange={(e) =>
                    setChangePasswordState((previousState) => {
                      return {
                        ...previousState,
                        currentPassword: e.target.value,
                      };
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={changePasswordState?.newPassword}
                  onChange={(e) =>
                    setChangePasswordState((previousState) => {
                      return {
                        ...previousState,
                        newPassword: e.target.value,
                      };
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={changePasswordState?.confirmPassword}
                  onChange={(e) =>
                    setChangePasswordState((previousState) => {
                      return {
                        ...previousState,
                        confirmPassword: e.target.value,
                      };
                    })
                  }
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">
                    Change Password
                    {passwordChangeLoadingState && (
                      <Loader className="ml-2 animate-spin" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will change your account password. You will
                      need to use the new password to log in next time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={updatePassword}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter>
        <Button className="w-full">Save Settings</Button>
      </CardFooter> */}
      </Card>
    </>
  );
}

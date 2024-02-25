"use client";
import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { ClerkLoaded, ClerkLoading, clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";
import { LoadingPage } from "../components/loadingSpinner";

// Client-side component for handling form submission and page refresh
const RoleSettingForm = ({ userId, targetRole }: { userId: string; targetRole: string }) => {
  const handleSetRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await setRole(formData);

      // Check if the role was set successfully
      if (response.message === "RoleUpdatedSuccessfully") {
        // Reload the page or navigate to the desired page
        window.location.reload(); // This will refresh the current page
        // Alternatively, you can use Next.js router to navigate to another page
        // import { useRouter } from 'next/router';
        // const router = useRouter();
        // router.reload();
      }
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  return (
    <form onSubmit={handleSetRole}>
      <input type="hidden" value={userId} name="id" />
      <input type="hidden" value={targetRole} name="role" />
      <button className="btn btn-outline" type="submit">
        Make {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}
      </button>
    </form>
  );
};

export default async function AdminDashboard(params: { searchParams: { search?: string } }) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  const users = await clerkClient.users.getUserList();

  return (
    <>
      <ClerkLoading>
        <LoadingPage />
      </ClerkLoading>
      <ClerkLoaded>
        <div className="p-6">
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Make Admin</th>
                <th>Make Moderator</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}</td>
                  <td>{user.publicMetadata.role as string}</td>
                  <td>
                    <RoleSettingForm userId={user.id} targetRole="admin" />
                  </td>
                  <td>
                    <RoleSettingForm userId={user.id} targetRole="moderator" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClerkLoaded>
    </>
  );
}

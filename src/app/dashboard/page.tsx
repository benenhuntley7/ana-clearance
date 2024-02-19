import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";

export default async function AdminDashboard(params: { searchParams: { search?: string } }) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  const users = await clerkClient.users.getUserList();

  return (
    <>
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
                  <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="admin" name="role" />
                    <button type="submit">Make Admin</button>
                  </form>
                </td>
                <td>
                  <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="moderator" name="role" />
                    <button className="btn btn-primary" type="submit">
                      Make Moderator
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

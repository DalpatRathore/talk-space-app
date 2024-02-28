import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col fixed h-full w-60 z-20 inset-y-0">
        <ServerSidebar serverId={params.serverId}></ServerSidebar>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};
export default ServerIdLayout;

import { checkRole } from "@/utils/roles";
import { SignOutButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header>
      <nav className="flex border-b justify-between items-center border-slate-400 p-4 bg-[#F58220]" aria-label="Global">
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image src={"/anaconda-footerimg.png"} alt="Anaconda" width={150} height={20} />
          </Link>
        </div>
        <div className="flex items-center font-semibold text-white">
          <SignedIn>
            {checkRole("admin") && (
              <>
                <Link href="/dashboard" className="mr-4">
                  Admin
                </Link>
                <Link href="/import" className="mr-4">
                  Import
                </Link>
                <SignOutButton />
              </>
            )}
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

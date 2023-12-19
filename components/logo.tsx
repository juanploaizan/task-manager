import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

export function Logo() {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center hidden md:flex">
        <p
          className={cn(
            "relative z-20 flex items-center text-lg font-semibold mr-4",
            headingFont.className
          )}
        >
          Task Manager
        </p>
      </div>
    </Link>
  );
}

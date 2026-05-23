import Image from "next/image";
import { cn } from "@/lib/utils";

interface DownloadBrandLogoProps {
  src: string;
  label: string;
  className?: string;
}

export function DownloadBrandLogo({
  src,
  label,
  className,
}: DownloadBrandLogoProps) {
  return (
    <Image
      src={src}
      alt=""
      width={120}
      height={48}
      className={cn("landing-download__logo", className)}
      aria-hidden
    />
  );
}

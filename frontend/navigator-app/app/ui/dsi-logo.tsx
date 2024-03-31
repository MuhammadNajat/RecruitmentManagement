import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image'


export default function DSiLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
              src="/dsi_logo_white.svg"
              alt="DSi Logo"
              className="dark:invert"
              width={120}
              height={26}
              priority
            />
      <span className="text-[44px]">DRM</span>
    </div>
  );
}

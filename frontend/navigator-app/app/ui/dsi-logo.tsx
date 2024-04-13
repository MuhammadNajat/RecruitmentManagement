import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image'
import DSiImage from '@/public/dsi_logo_white.svg'

export default function DSiLogo() {
  return (

    <div className='text-center pl-9 pb-5 pt-5'
    >
      <Image
              src={DSiImage}
              alt="DSi Logo"
              width={150}
              height={150}
              content='center'
            />

      <span className="text-[20px] pl-4 mt-4">Recruitbox</span>
    </div>

    /*
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
  */
  );
}

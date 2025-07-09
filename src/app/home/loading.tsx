import Image from 'next/image';

export default function Loading() {
  return (
    <div className="bg-zinc-900 min-h-[100vh] w-[100%] flex flex-row justify-center items-center">
      <Image
        className="animate-pulse absolute  z-999"
        alt=""
        src={'/icon.png'}
        height={100}
        width={100}
      />
    </div>
  );
}

import Image from "next/image";
export default function SectionTitle({ imageRight, imageLeft, title }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 mx-auto w-fit">
      <div className="relative flex items-center justify-between gap-5">
        <Image
          src={imageRight}
          width={100}
          height={100}
          alt=""
          className="size-10 shrink-0"
        />
        <h1 className="relative text-4xl font-bold">{title}</h1>
        <Image
          src={imageLeft}
          width={100}
          height={100}
          alt=""
          className="size-10 shrink-0"
        />
      </div>

      <div className="w-full h-2 bg-yellow-500 rounded-3xl"></div>
    </div>
  );
}

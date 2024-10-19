import getStaticMetadata from "@/lib/getStaticMetadata";
import Recent from "@/components/Recent";

export const metadata = getStaticMetadata();

export default async function Home() {
  return (
    <>
      <Recent />
    </>
  );
}

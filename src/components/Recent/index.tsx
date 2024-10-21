import getRecent from "@/lib/getRecent";
import Article from "./Article";

export default async function Recent() {
  const objects = await getRecent();
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 grid-rows-1">
      {objects.slice(0, 16).map(o => <Article key={o.data.title} {...o} />)}
    </div>
  );
}
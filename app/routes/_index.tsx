import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Poetry Galore" },
    { name: "description", content: "Great poems for all poetry lovers" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Poetry Galore</h1>
    </div>
  );
}

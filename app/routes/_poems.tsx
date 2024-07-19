import { Links, Meta, Outlet, Scripts, useRouteError } from "@remix-run/react";



export default function PoemsLayout() {
  return (
    <div className="relative max-w-[1920px]">
      <Outlet />
    </div>
  );
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/groups")({
  component: GroupsLayout,
});

function GroupsLayout() {
  return <Outlet />;
}

import { createFileRoute } from "@tanstack/react-router";
import SolarSystem from "@/components/SolarSystem";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <SolarSystem />;
}

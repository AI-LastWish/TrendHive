import { initializeCron } from "@/lib/cron";


export function GET() {
  initializeCron();
  return new Response("Cron job initialized");
}

import cron from "node-cron";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const initializeCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const response = await axios.get(`${API_URL}/api/fetchPosts`);
      console.log("Cron job fetched posts successfully:", response.data.posts);
    } catch (error) {
      console.error("Cron job failed:", (error as Error).message);
    }
  });
};

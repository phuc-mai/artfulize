import { connectToDB } from "@app/mongodb/database";
import Work from "@models/Work";

export const GET = async (req) => {
  try {
    await connectToDB();

    const work = await Work.find({}).populate("creator");

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch all work", { status: 500 });
  }
};

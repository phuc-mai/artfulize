import { connectToDB } from "@app/mongodb/database";
import Work from "@models/Work";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { category } = params;

    let work;

    if (category !== 'All') {
      work = await Work.find({ category }).populate("creator");
    } else {
      work = await Work.find().populate("creator");
    }

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch work", { status: 500 });
  }
};

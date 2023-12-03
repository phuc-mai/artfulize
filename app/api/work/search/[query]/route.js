import Work from "@models/Work";
import { connectToDB } from "@app/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;
    let work = [];
    
    if (query == "all") {
      work = await Work.find().populate("creator");
    }
    else work = await Work.find({
      $or: [
        { 'category': { $regex: query, $options: 'i' } },
        { 'title': { $regex: query, $options: 'i' } }
      ]
    }).populate("creator");

    if(!work) return new Response("the Work Not Found", { status: 404 });

    return new Response(JSON.stringify(work), { status: 200 });

  } catch (err) {
    console.log(err)
    return new Response("Internal Server Error", { status: 500 });
  }
};
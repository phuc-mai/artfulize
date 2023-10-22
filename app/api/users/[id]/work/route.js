import Work from "@models/Work";
import { connectToDB } from "@app/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const work = await Work.find({ creator: params.id }).populate("creator")

    return new Response(JSON.stringify(work), { status: 200 })

  } catch (err) {
    return new Response("Failed to fetch prompts created by user", { status: 500 })
  }
}
import Work from "@models/Work";
import User from "@models/User";

import { connectToDB } from "@app/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const user = await User.findById(params.id)
    const work = await Work.find({ creator: params.id }).populate("creator")

    user.work = work
    await user.save();

    return new Response(JSON.stringify({ profile: user, work: work } ), { status: 200 })

  } catch (err) {
    return new Response("Failed to fetch prompts created by user", { status: 500 })
  }
}

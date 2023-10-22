import Work from "@models/Work";
import User from "@models/User";
import { connectToDB } from "@app/mongodb/database";

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB()
    const userId = params.id;
    const workId = params.workId;
    
    /* Check if the user and listing exist */
    const user = await User.findById(userId)
    const work = await Work.findById(workId).populate("creator")
    if (!user) {
      return new Response("User not found", { status: 404 })
    }
    if (!work) {
      return new Response("Work not found", { status: 500 })
    }    
    
    /* Add to Wishlist */
    const favoriteWork = user.wishlist.find((item) => item._id.toString() === workId)
  
    if (favoriteWork) {
      user.wishlist = user.wishlist.filter((item) => item._id.toString() !== workId)
      await user.save()
      return new Response(JSON.stringify({message: "Work removed from wishlist", wishlist: user.wishlist}), { status: 200 })
    } else {
      user.wishlist.push(work);
      await user.save();
      return new Response(JSON.stringify({message:"Work added to wishlist", wishlist: user.wishlist }), { status: 200})
    }

  } catch (err) {
    console.log(err)
    return new Response("Failed to patch work to Wishlist", { status: 500 })
  }
}
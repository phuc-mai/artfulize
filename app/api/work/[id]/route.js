import Work from "@models/Work";
import { connectToDB } from "@app/mongodb/database";
import { writeFile } from "fs/promises"

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const work = await Work.findById(params.id).populate("creator");
    if (!work) return new Response("the Work Not Found", { status: 404 });

    return new Response(JSON.stringify(work), { status: 200 });

  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const data = await req.formData();

    /* Extract information from the form */
    const category = data.get('category');
    const title = data.get('title');
    const description = data.get('description');
    const price = data.get('price');

    /* Get an array of uploaded photos */
    const photos = data.getAll('workPhotosPaths');

    const workPhotosPaths = []

    /* Process and store each uploaded photo */
    for (const photo of photos) {
      /* Check if it's a new photo means "Object" */
      if (photo instanceof Object) {
         // Read the photo as an ArrayBuffer
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the destination path for the uploaded file
        const workImagePath = `/Developer/Projects/artfulize/public/uploads/${photo.name}`;

        console.log(workImagePath)

        // Write the buffer to the filesystem
        await writeFile(workImagePath, buffer);

        // Store the file path in an array
        workPhotosPaths.push(`/uploads/${photo.name}`);
      }
      /* If it's an old photo */
      else {
        workPhotosPaths.push(photo);
      }
    }

    console.log(workPhotosPaths);

    // Find the existing work by ID
    const existingWork = await Work.findById(params.id);
    
    if (!existingWork)
      return new Response("Work Not Found", { status: 404 });

    // Update the Work with new data
    existingWork.category = category;
    existingWork.title = title;
    existingWork.description = description;
    existingWork.price = price;
    existingWork.workPhotosPaths = workPhotosPaths;

    await existingWork.save();

    return new Response("Successfully updated the Work", { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Error updating the Work", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    // Find the Work by ID and remove it
    await Work.findByIdAndRemove(params.id);

    return new Response("Successfully deleted the Work", { status: 200 });
  } catch (err) {
    return new Response("Error deleting the Work", { status: 500 });
  }
};

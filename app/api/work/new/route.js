import { connectToDB } from "@app/mongodb/database";
import Work from "@models/Work";
import { writeFile } from "fs/promises"
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    /* Connect to the database */
    await connectToDB();

    const data = await req.formData();

    /* Extract information from the form */
    const creator = data.get('creator');
    const category = data.get('category');
    const title = data.get('title');
    const description = data.get('description');
    const price = data.get('price');

    /* Get an array of uploaded photos */
    const photos = data.getAll('workPhotosPaths');

    /* Check if photos were uploaded */
    if (!photos || photos.length === 0) {
      return NextResponse.json({ message: "No photo uploaded" }, { status: 400 });
    }

    const workPhotosPaths = []

    /* Process and store each uploaded photo */
    for (const photo of photos) {
      // Read the photo as an ArrayBuffer
      const bytes = await photo.arrayBuffer();

      // Converts it to a Buffer
      const buffer = Buffer.from(bytes);

      // Define the destination path for the uploaded file
      const workImagePath = `/Developer/Portfolio Projects/artfulize/public/uploads/${photo.name}`;

      // Write the buffer to the filesystem
      await writeFile(workImagePath, buffer);

      // Store the file path in an array
      workPhotosPaths.push(`/uploads/${photo.name}`);
    }

    /* Create a new Work */
    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      workPhotosPaths,
    });

    /* Save new User */
    await newWork.save();

    /* Send a success response */
    return new Response(JSON.stringify(newWork), { status: 200 })
  }
  catch (err) {
    console.log(err)
    return new Response("Failed to create a new Work", { status: 500 })
  }
}

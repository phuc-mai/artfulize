import { connectToDB } from "../../../mongodb/database";
import User from "@models/User";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
import { hash } from "bcryptjs";


/* USER REGISTER */
export async function POST(req) {
  try {
    /* Connect to the database */
    await connectToDB();

    const data = await req.formData();

    /* Take information from the form */
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    const file = data.get('profileImage');

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const profileImagePath = `/Developer/Portfolio Projects/artfulize/public/uploads/${file.name}`
    await writeFile(profileImagePath, buffer)
    
    console.log(`open ${profileImagePath} to see the uploaded file`)

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists!" }, { status: 409 });
    }

    /* Hass the password */
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    /* Create a new User */
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImagePath: `/uploads/${file.name}`,
      wishList: [],
      cart: [],
      work: [],
    });

    /* save new User */
    await newUser.save();

    /* Send a success response */
    return NextResponse.json({ message: "User registered successfully!", user: newUser  }, { status: 200 });
  }
  catch (e) {
    console.log(e)
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

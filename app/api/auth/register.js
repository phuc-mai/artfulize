import { connectToDB } from "@mongodb/database";
import User from "@models/User";

import { hash } from "bcryptjs";

/* Configure Multer for FILE UPLOADS */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

/* USER REGISTER */

export default async function register(req, res) {
  if (req.method === "POST") {
    /* Connect to the database */
    await connectToDB();

    /* Take information from the form */
    const { username, email, password } = req.body;

    /* The uploaded file is available as req.file */
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded.");
    }

    /* Path to the uploaded profile photo */
    const profileImagePath = profileImage.path;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hass the password */
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    /* Create a new User */
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImagePath,
      wishList: [],
      cart: [],
      work: [],
    });

    /* save new User */
    await newUser.save();

    /* Send a success response */
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
    /* Handle any errors that occur during registration */
  } else {
    res.status(405).end(); // Method not allowed
  }
}

import { connectToDB } from "@mongodb/database";
import User from "@models/User";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    /* Connect to the database */
    await connectToDB();

    /* Take information from the form */
    const { email, password } = req.body;

    /* Check if user exists */
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    /* Compare password */
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } else {
    res.status(405).end(); // Method not allowed
  }
}

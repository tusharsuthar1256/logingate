import { connectDB } from "@/lib/db";
import { User } from "@/model/User.model";
import { hashPassword } from "@/lib/bcrypt";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) return Response.json({ error: "User already exists!" });

    const hashed = await hashPassword(password);

    await User.create({ name, email, password: hashed });

    return Response.json({ message: "User registered successfully" });
  } catch (err) {
    return Response.json({ error: "Something went wrong" });
  }
}

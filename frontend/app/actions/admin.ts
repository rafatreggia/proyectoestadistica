"use server";
import connectMongoDb from "@/lib/mongoDB";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// export const createAdmin = async (email: string, password: string) => {
//   try {
//     let hashedPassword = await bcrypt.hash(password, 10);
//     await connectMongoDb();
//     let newAdmin = await Admin.create({
//       email: email,
//       password: hashedPassword,
//     });
//     return { ok: true };
//   } catch (error) {
//     console.log(error);
//     return { ok: false };
//   }
// };

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export const loginAdmin = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { ok: false, message: "Datos Incompletos" };
    }
    await connectMongoDb();
    let foundAdmin = await Admin.findOne({ email: email });
    if (!foundAdmin) {
      return { ok: false, message: "Credenciales Invalidas" };
    }
    let matchPassword = await bcrypt.compare(password, foundAdmin.password);
    if (!matchPassword) {
      return { ok: false, message: "Credenciales Invalidas" };
    }
    // let newToken = jwt.sign(
    //   { _id: foundAdmin._id, userType: "admin" },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: "1d" }
    // );
    let newToken = await encrypt({
      _id: foundAdmin._id.toString(),
      userType: "admin",
    });
    cookies().set("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
    });
    return { ok: true, message: "Se envio Correctamente" };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Algo Salio Mal" };
  }
};

export const validateSessionAdmin = async () => {
  try {
    let validToken = await cookies().get("token");

    if (!validToken) {
      return null;
    }
    // let decoded: any = jwt.verify(
    //   validToken.value,
    //   process.env.JWT_SECRET as string
    // );
    // console.log(decoded);
    let decoded = await decrypt(validToken.value);
    if (!decoded) {
      return null;
    }
    if (decoded.userType != "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.log("Algo salio mal");
    console.log(error);
    return null;
  }
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 hour from now")
    .sign(key);
}

export async function decrypt(input: any) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

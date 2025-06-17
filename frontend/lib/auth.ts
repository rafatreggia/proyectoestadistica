"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
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

/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";
import { config } from "@/server/config";
import mongoose from "mongoose";

const db = await config();
const MONGODB_URI =
  db.node_env === "development" ? db.database_url_local : db.database_url_dev;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

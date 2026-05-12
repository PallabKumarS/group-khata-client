/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";
import config from "@/server/config";
import mongoose from "mongoose";

const MONGODB_URI =
  config.node_env === "development"
    ? config.database_url_local!
    : config.database_url_dev!;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

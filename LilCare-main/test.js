import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config(); // load variables from .env

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client.on("error", (err) => {
    console.error("Erreur client PostgreSQL:", err);
  });

  try {
    await client.connect();
    console.log("Connexion réussie !");
  } catch (err) {
    console.error("Erreur de connexion :", err);
  } finally {
    await client.end();
  }
}

testConnection();

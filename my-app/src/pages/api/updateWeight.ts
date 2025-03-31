import type { NextApiRequest, NextApiResponse } from "next";

let userData = { name: "username", weight: 70 };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "PUT") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { weight } = req.body;

        if (weight === undefined || isNaN(weight)) {
            return res.status(400).json({ error: "Invalid weight" });
        }

        userData.weight = weight;
        return res.status(200).json({ message: "Weight updated", weight });
    } catch (error) {
        console.error("Error updating weight:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

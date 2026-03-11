"use client";

import { useState } from "react";

export default function GenerateButton() {

  const [loading, setLoading] = useState(false);

  const generate = async () => {

    setLoading(true);

    const res = await fetch("/api/generate-timetable", {
      method: "POST",
      body: JSON.stringify({
        days: 5,
        periods: 6,
        rooms: 10,
        labs: 2,
        school: {
          "Class10": {
            "A": {
              "Math": { teacher: "Sharma", limit: 5, lab: false },
              "Physics": { teacher: "Gupta", limit: 4, lab: true }
            }
          }
        }
      })
    });

    const data = await res.json();

    console.log(data);
    setLoading(false);
  };

  return (
    <button
      onClick={generate}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {loading ? "Generating..." : "Generate Timetable"}
    </button>
  );
}
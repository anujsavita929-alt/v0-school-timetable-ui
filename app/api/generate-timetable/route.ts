import { spawn } from "child_process";

export async function POST(req: Request) {

  const data = await req.json();

  return new Promise((resolve) => {

    const py = spawn("python", ["generatingalgo/api_scheduler.py"]);

    py.stdin.write(JSON.stringify(data));
    py.stdin.end();

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stdout.on("end", () => {
      resolve(
        new Response(result, {
          headers: { "Content-Type": "application/json" },
        })
      );
    });

  });
}
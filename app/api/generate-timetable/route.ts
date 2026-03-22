import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Path to the python script
    const scriptPath = path.join(process.cwd(), "generatingalgo", "genetic_scheduler.py");
    
    // Spawn python process
    const pythonProcess = spawn("python", [scriptPath]);
    
    let resultData = "";
    
    // Write input data to stdin
    pythonProcess.stdin.write(JSON.stringify(body));
    pythonProcess.stdin.end();
    
    // Return a promise that resolves when the python script finishes
    const result = await new Promise((resolve, reject) => {
      pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
      });
      
      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
      });
      
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`));
        } else {
          try {
            resolve(JSON.parse(resultData));
          } catch (e) {
            reject(new Error("Failed to parse python output"));
          }
        }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
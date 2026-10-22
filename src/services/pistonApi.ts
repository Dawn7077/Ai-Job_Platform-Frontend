import axios from "axios";
import { version } from "os";
 
const BACKEND_URL = "http://localhost:3000/user/run-code";

// const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
//   javascript: { language: "javascript", version: "18.15.0" },
//   python: { language: "python", version: "3.10.0" },
//   java: { language: "java", version: "15.0.2" },
//   cpp: { language: "cpp", version: "10.2.0" },
// };

export const executeCode =async (
    language:string,
    sourceCode:string
) =>{ 

    const response = await axios.post(BACKEND_URL,{
        language,
        sourceCode
    })
    console.log('runcode send')
    if(response)
        console.log('runcode recieved',response)

    return response.data
}

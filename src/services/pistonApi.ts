import axios from "axios";
 
const JUDGE0_URL ="https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"

const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // JavaScript (Node.js 18.15.0)
  python: 71,     // Python (3.8.1)
  java: 62,       // Java (OpenJDK 13.0.1)
  cpp: 54,        // C++ (GCC 9.2.0)
};

export const executeCode =async (
    language:string,
    sourceCode:string
) =>{
    const language_id = JUDGE0_LANGUAGE_IDS[language] || 63

    const response = await axios.post (
         JUDGE0_URL ,{
            sourceCode:sourceCode,
            language_id:language_id
        },{
            headers:{
                "Content-Type":"application/json",
                "X-RapidAPI-Key":"",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            }
        }
    )

    return response.data
}

import React, { useState } from "react" 
import { executeCode } from "../../../services/pistonApi"
import { AlertCircle, CheckCircle2, Loader2, Play, Terminal } from "lucide-react"


interface OutputTerminalProps{
    language:string
    editorValue:string
}

export const OutputTerminal:React.FC<OutputTerminalProps> = ({
    language,
    editorValue
})=>{
    const [output,setOutput] = useState<string[] | null>(null)
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isError,setIsError] = useState<boolean>(false) 

    
    const runCode = async()=>{
        if(!editorValue)return
        
        setIsError(false)
        setIsLoading(true)
        try {
            const result = await executeCode(language,editorValue)
            const runResult = result.run

            const lines = runResult.output ? runResult.output.split('\n'):['No output generated.']
            setOutput(lines)
            setIsError(!runResult.stderr)
        } catch (error) {
            setIsError( true )
            setOutput([
                error.response?.data?.message || 
                error.message ||
                'An error occured while compiling code.'
            ])
            
        }finally{
            setIsLoading(false)
        }

    }
    
    return( 
        <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-gray-800 font-mono text-xs">
            {/* Console header toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex  items-center space-x-2 text-gray-400">
                    < Terminal className="w-4 h-4 text-indigo-400 " />
                    <span className="font-semibold tracking-wider text-xs uppercase">
                        Output Terminal
                    </span>
                </div>

                <button
                    onClick={runCode}
                    disabled ={isLoading}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
                    text-white font-sans text-xs font-medium px-3.5 py-1.5 rounded-md transition shadow"
                >
                    {isLoading?(
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                            <span>Running ...</span>
                        </>
                    ):(
                        <>
                            <Play className="w-3.5 h-3.5 fill-current"/>
                            <span>Run Code</span>
                        </>
                    )}
                </button>
            </div>

            {/* Output stream panel */}
            <div className="flex-1 p-4 overflow-y-auto space-y-1">
                {!output && !isLoading &&(
                    <div className="text-gray-600 italic">
                        Click "Run Code" to compile and see standard output...
                    </div>
                )}

                {isLoading &&(
                    <div className="flex items-center space-x-1 text-emerald-400 ">
                        <Loader2 className="w-3.5 h-3.5"/>
                        <span>Compiling and running in sandbox...</span>
                    </div>
                )}

                {output &&(
                    <div className="space-y-1"> 
                        <div className="flex items-center space-x-1.5 mb-2">
                            {isError ?
                                (
                                    <div className="flex items-center space-x-1 text-red-400 text-[11px] font-sans">
                                        <AlertCircle className="w-3.5 h-3.5"/>
                                        <span>Execution finished with error:</span>
                                    </div>
                                ):(
                                    <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-sans">
                                        <CheckCircle2 className="w-3.5 h-3.5"/>
                                        <span>Executed successfully:</span>
                                    </div>
                                )
                            }
                        </div>

                        {output.map((line,idx)=>(
                            <p
                                key={idx}
                                className={`whitespace-pre-wrap ${
                                    isError?'text-red-400':"text-gray-200"
                                }` }
                            >
                                {line}
                            </p>
                        ))}

                    </div>
                )}
            </div>

        </div>
    )
}
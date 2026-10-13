import React, { useRef, useState } from "react"
import { LANGUAGE_VERSION } from "../../constants/codeEditorConfigs"
import { Editor, OnMount } from "@monaco-editor/react"
import { LanguageSelector } from "../../components/ui/CodeEditor/LanguageSelector"
import { OutputTerminal } from "../../components/ui/CodeEditor/OutPutTerminal"
import type { editor } from "monaco-editor";
interface CodeEditorProps{
    onCodeChange?:(code:string)=>void
}

export const CodeEditor:React.FC<CodeEditorProps> = ({onCodeChange})=>{
    const [language,setLanguage] = useState<string>('javascript')
    const [value,setValue] = useState<string>(
        LANGUAGE_VERSION['javascript'].snippet
    )

    const editorRef = useRef<editor.IStandaloneCodeEditor|null>(null)

    const handleEditorMount:OnMount = (editor)=>{
        editorRef.current=  editor
        editor.focus()
    }

    const handleSelectLanguage =(selectedLang:string)=>{
        setLanguage(selectedLang)
        const defaultSnippet = LANGUAGE_VERSION[selectedLang].snippet
        setValue(defaultSnippet)
        if(onCodeChange)onCodeChange(defaultSnippet)
    }

    const handleCodeChange = (newValue:string | undefined)=>{
        const code = newValue || ''
        setValue(code)
        if(onCodeChange)onCodeChange(code)
    }

    return(
        <div className="flex flex-col h-full w-full bg-gray-900 rounded-lg overflow-hidden border-gray-800">
            {/* Top header */}
            <div className="px-4 py-2.5 flex items-center justify-between bg-gray-800 border-b border-gray-700">
                <LanguageSelector
                    language={language}
                    onSelect={handleSelectLanguage}
                />
            </div>

            {/* Editor & Console split view  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden p-2 gap-2">
                {/* Monaco Editor Frame */}
                <div className="h-full rounded-lg overflow-hidden border border-gray-800 bg-gray-950">
                    <Editor
                        height='100%'
                        theme="vs-dark"
                        language={language}
                        value={value}
                        onMount={handleEditorMount}
                        onChange={handleCodeChange}
                        options={{
                            fontSize:14,
                            minimap:{enabled:false},
                            automaticLayout:true,
                            scrollBeyondLastLine:false,
                            tabSize:2,
                        }}
                    />

                </div>
                {/* Output console frame */}
                <div className="h-full">
                    <OutputTerminal
                    language={language}
                    editorValue={value}
                    />
                </div>
            </div>
        </div>
    )
}
import { LANGUAGE_VERSION } from "../../../constants/codeEditorConfigs";
import { Code2 } from "lucide-react";

interface LanguageSelectorProps {
    language:string
    onSelect:(lang:string)=>void
}

export const LanguageSelector:React.FC<LanguageSelectorProps>=({
    language,
    onSelect
})=>{
    return(
        <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400"/>
             <label className="text-xs text-gray-300 font-medium hidden sm:inline">
                language:
                </label>   
                <select 
                value={language}
                onChange={(e)=>onSelect(e.target.value)}
                className="bg-gray-800 text-gray-200 text-xs sm:">

                    {Object.entries(LANGUAGE_VERSION).map(([langKey,langDetails])=>(
                        <option key={langKey} value={langKey}>
                            {langDetails.label} ({langDetails.version})
                        </option>
                    ))}
                </select>
        </div>
    ) 
}
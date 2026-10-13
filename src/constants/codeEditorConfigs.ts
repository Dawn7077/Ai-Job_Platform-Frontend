export interface LanguageConfig{
    [key:string]:{
        version:string
        label:string
        snippet:string
    }
}

export const LANGUAGE_VERSION: LanguageConfig ={
    javascript:{
        version:"18.15.0",
        label:"JavaScript (Node.js)",
        snippet:`function greet(name){
        \n    console.log("Hello, "+ name +"!");
        \n}
        \n\n greet("Candidate");`,
    },
    typescript:{
        version:"5.0.3",
        label:"TypeScript",
        snippet:`function greet(name: string):void {
        \n    console.log("Hello, "+ name +"!");
        \n}
        \n\n greet("Candidate");`,
    },
    python:{
        version:"3.10.0",
        label:"Python 3",
        snippet:`def greet(name )
        \n     print(f"Hello, {name} !");
        \n}
        \n\n greet("Candidate")`,
    },
    java:{
        version:"15.0.2",
        label:"Java",
        snippet:`public class Main {
        \n     public static void main(String []args){
        \n           System.out.println("Hello Candidate !") 
        \n     }
        \n}`,
    },
    cpp:{
        version:"10.2.0",
        label:"C++",
        snippet:`include <iostream>
        \n\n    main(){
        \n        std::cout << "Hello Candidate !" << std::end; 
        \n    return 0;
        \n}`,
    },
    csharp:{
        version:"6.12.0",
        label:"C#",
        snippet:`using System;
        \n\nclass Program{
        \n    static void Main(){
        \n        Console.WriteLine("Hello, Candidate!");
        \n    }
        \n}`,
    },

}
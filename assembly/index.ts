import "../node_modules/as-wasi/assembly/index";
import { JSON } from "../node_modules/assemblyscript-json/assembly/index";

import {Console, CommandLine} from "../node_modules/as-wasi/assembly/";
import { proc_exit } from "@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1";
import { Obj, Value} from "assemblyscript-json/assembly/JSON";



main();

export function main(): void {
    
    const args = new CommandLine().args;    
    
    const action = args[1];



    if (action == "manifest") {
        manifest();
    } else if (action == "transform") {
        transform(args[2], args[3]);
    } else {
        Console.log("invalid action " + action)
    }
    proc_exit(0);
}

function transform(from: string, to: string): void {
    if (from == "vigenere") {
        transform_vigenere(to);
    }else{
        Console.error("package does not support " + from)
    }
}

function transform_vigenere(to: string): void {
    const stdin: string | null = Console.readAll();
    if (stdin == null) {
        Console.error("stdin is null");
        proc_exit(1);
        return;
    }

    const data = <JSON.Obj>(JSON.parse(stdin));
    const text: string = data.getString("data")!.toString();
    const args = <JSON.Obj>(data.get("arguments"));
    const key = args.getString("key")!.toString();
    
    const encrypted = encrypt_vigenere(text, key);

    let string = "";

    let split = encrypted.split("\n");

    if (to == "html") {
        string = html(split);
    }else if(to == "latex") {
        string = latex(split);
    }
    
    Console.log(string);
}
 
function html(lines: string[]) : string{
    let jsonArr = new JSON.Arr();
    for (let i = 0; i < lines.length; i++) {
        jsonArr.push(raw("<p>"+lines[i]+"</p>"));
    }
    return jsonArr.stringify();
}

function latex(lines: string[]) : string{
    let jsonArr = new JSON.Arr();
    for (let i = 0; i < lines.length; i++) {
        jsonArr.push(raw(escape_latex(lines[i])));
        jsonArr.push(raw("\\\\"));
    }
    return jsonArr.stringify();
}

function raw(text: string): JSON.Obj {
    let obj = new JSON.Obj();
    obj.set("name", "raw");
    obj.set("data", text);
    return obj;
}

function escape_latex(text: string) : string{
    let result : string= text.split('\\')
    .map((t: string) =>
      t.replace('{', '\\{')
        .replace('}', '\\}')
    )
    .join('\\textbackslash{}')
    .replace('#', '\\#')
    .replace('$', '\\$')
    .replace('%', '\\%')
    .replace('&', '\\&')
    .replace('_', '\\_')
    .replace('<', '\\textless{}')
    .replace('>', '\\textgreater{}')
    .replace('~', '\\textasciitilde{}')
    .replace('^', '\\textasciicircum{}');

    return result;
}



function encrypt_vigenere(s: string, key: string): string {
    let result = "";
    let nonNumerical = 0;
    for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        let k = key.charCodeAt((i-nonNumerical)% key.length);
        
        if (isAlphabetic(s.charAt(i))) {
            let stringOffset = isUpperCase(s.charAt(i)) ? 65:97;
            let keyOffset = isUpperCase(key.charAt((i-nonNumerical) % key.length)) ? 65 : 97;
            

            let encryptedCharCode = (c - stringOffset + (k -keyOffset)) % 26 + stringOffset;

            result += String.fromCharCode(encryptedCharCode);
        } else {
            result += s.charAt(i);
            nonNumerical++;
        }
    }
    return result;
}

function isUpperCase(char: string): bool {
    let code = char.charCodeAt(0);
    return code >= 65 && code <= 90;
  }

function isAlphabetic(char: string): bool {
  let code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}



function manifest(): void {
    Console.log('{"name": "vigenere" ,"version":"1.0","description":"this package support vigenere modules which can be used to encrypt text","transforms":[{"from":"vigenere","to":["html","latex"],"arguments":[{"name":"key","default":"","description":"key used to decrypt text"}]}]}');
    proc_exit(0);
}
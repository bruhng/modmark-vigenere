import "../node_modules/as-wasi/assembly/index";
import { JSON } from "../node_modules/assemblyscript-json/assembly/index";

import {Console, CommandLine} from "../node_modules/as-wasi/assembly/";


main();


export function main(): void {
    
    const args = new CommandLine();    

    const action = args.get(1);
    if (action == "manifest") {
        manifest();
    } else if (action == "transform") {
        transform(args.get(2)!, args.get(3)!);
    } else {
        Console.error("invalid action " + action!)
    }

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
        return;
    }

    const data = <JSON.Obj>(JSON.parse(stdin));
    const text: string = data.getString("data")!.toString();
    const args = <JSON.Obj>(data.get("arguments"));
    const key = args.getString("key")!.toString();
    
    const encrypted = encrypt_vigenere(text, key);

    let string = "";

    if (to == "html") {
        string = '[{"name": "raw", "data": "<p>' + encrypted + '</p>"}]'
    }else if(to == "latex") {
        string = '[{"name": "raw", "data": ' + encrypted + '}]'
    }
    let result = <JSON.Obj>(JSON.parse(string));
    Console.log(result.stringify());
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
    Console.log('{"name":"vigenere","version":"0.1","description":"this package support vigenere modules which can be used to encrypt text","transforms":[{"from":"vigenere","to":["html","latex"],"arguments":[{"name":"key","default":"","description":"key used to decrypt text"}]}]}');
}
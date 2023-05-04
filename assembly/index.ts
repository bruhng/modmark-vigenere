import "../node_modules/as-wasi/assembly/index";
import { JSON } from "../node_modules/assemblyscript-json/assembly/index";

import {Console, CommandLine} from "../node_modules/as-wasi/assembly/";





export function main(): void {
    
    const args = new CommandLine();


    const action = args.get(0);
    //Console.log("action: " + action!.toString())
    if (action == "manifest") {
        manifest();
    } else if (action == "transform") {
        transform(args.get(1)!, args.get(2)!);
    } else {
        Console.error("invalid action " + action!)
    }

}

function transform(from: string, to: string): void {
    if (from == "vigenere") {
        transform_vigenere(to);
    }else{
        Console.error("package does not support" + from)
    }
}

function transform_vigenere(to: string): void {
    const stdin: string | null = Console.readAll();
    if (stdin == null) {
        Console.error("stdin is null");
        return;
    }
    let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse(stdin));

    let text = jsonObj.getString("text");
    let key = jsonObj.getString("key");

    if (text == null || key == null) {
        Console.error("text or key is null");
    }

    if (to == "html") {

    }else if(to == "latex") {


        let string = '[{"name": "raw", "data": ' + text!.toString() + '}]'
        let result = <JSON.Obj>(JSON.parse(string));

        Console.log(result.stringify());
    }

}





function manifest(): void {
    //const output: JSON.Obj =
        //<JSON.Obj>(
            //JSON.parse('{"name":"vigenere","version":"0.1","description":"this package support vigenere modules which can be used to encrypt text","transforms":[{"from":"vigenere","to":["html","latex"],"arguments":[{"name":"key","default":"","description":"key used to decrypt text"}]}]}'
            //));
    //let json = output.stringify();
    Console.log('{"name":"vigenere","version":"0.1","description":"this package support vigenere modules which can be used to encrypt text","transforms":[{"from":"vigenere","to":["html","latex"],"arguments":[{"name":"key","default":"","description":"key used to decrypt text"}]}]}');
}
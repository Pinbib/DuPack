const VERSION = "0.3.0";

import chalk from 'chalk';
import { exec } from 'child_process';
import { log } from 'console';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import prompt_d from "prompt-sync";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prompt = prompt_d();
const arg = process.argv;
const main = process.cwd();

function folderExists(folderPath) {
    try {
        fs.accessSync(folderPath);
        return true;
    } catch (err) {
        return false;
    }
}

if (!folderExists("./src")) {
    fs.mkdirSync("./src");
}

if (arg.length > 1) {
    if (arg[2] == "request") {
        var src = prompt(chalk.white.bold("Enter the path to the folder where DuScript was installed:"));
        if (folderExists(src)) {
            fs.writeFileSync("./src/dus.src", src);
        } else {
            console.error(chalk.red.bold("Directory \"" + src + "\" does not exist."));
        }

        var src1 = prompt(chalk.white.bold("Enter the path to the folder where DuSharp was installed:"));
        if (folderExists(src)) {
            fs.writeFileSync("./src/ducs.src", src);
        } else {
            console.error(chalk.red.bold("Directory \"" + src + "\" does not exist."));
        }

        if (fs.existsSync("./src/dus.src")) {
            let s = fs.readFileSync("./src/dus.src", { encoding: "utf-8" });
            if (s == src) {
                console.log(chalk.green.bold("DuScript location was successfully saved."))
            } else {
                console.error(chalk.red.bold("There was a problem saving the DuScript location as text."))
            }
        } else {
            console.error(chalk.red.bold("DuScript's location has not been saved."))
        }

        if (fs.existsSync("./src/ducs.src")) {
            let s = fs.readFileSync("./src/ducs.src", { encoding: "utf-8" });
            if (s == src1) {
                console.log(chalk.green.bold("DuSharp location was successfully saved."))
            } else {
                console.error(chalk.red.bold("There was a problem saving the DuSharp location as text."))
            }
        } else {
            console.error(chalk.red.bold("DuSharp's location has not been saved."))
        }
    } else if (arg[2] == "version") {
        if (fs.existsSync("./src/dus.src")) {
            var sed = fs.readFileSync("./src/dus.src", { encoding: "utf-8" });
            if (!/\w/gm.test(sed)) {
                console.error(chalk.red.bold("You didn't write down the DuScript storage path, you can do it with the command:"));
                console.error("         ", chalk.white.underline("du request"))
            } else {
                console.log(chalk.white.bold("duScript: " + JSON.parse(fs.readFileSync(path.join(sed, "package.json"))).version))
            }
        }
    } else if (arg[2] == "new") {
        if (fs.existsSync("./src/save.txt")) {
            fs.writeFileSync("./src/save.txt", fs.readFileSync("./src/save.txt", { encoding: "utf-8" }) + ",\n" + main);
        } else {
            fs.writeFileSync("./src/save.txt", main)
        }
        if (arg[3] != undefined) {
            fs.mkdirSync(path.join(main, arg.slice(3).join(" ")))
        } else {
            var calllist = prompt(chalk.white.bold("Enter the names of the executable files separated by spaces:")).split(" ");
            var addMod = prompt(chalk.white.bold("Add block of modules?(yes/no)"));

            if (addMod == "yes") {
                var hasend = true;
                var importmod = [];
                log(chalk.white.bold("Enter the name and path separated by a space to finish type \"false\": "))
                while (hasend) {

                    var timport = prompt(chalk.white.bold("     Enter the name and path: "));
                    if (timport == "false") {
                        hasend = false;
                    } else {
                        importmod.push(`
                    {
                        "name": "${timport.split(" ")[0]}",
                        "from": "${timport.split(" ")[1]}"
                    }`);
                    }

                    addMod = importmod;
                }
            }
            if (addMod !== "no") {
                let type;
                let job = true;
                while (job) {
                    let typ = prompt(chalk.white.bold("Specify the du language type: ")).replace(/^\s+|\s+$|\s/gm, "");

                    switch (typ) {
                        case "DuScript":
                            typ = typ;
                            job = false;
                            break;
                        case "DuScharp":
                            typ = typ;
                            job = false;
                            break;
                        default:
                            console.error(chalk.red.bold("It is not a type of du language."))
                            break;
                    }
                }
                fs.writeFileSync(path.join(main, "Door.json"), `
                {
                    "call": [
                        ${calllist.map(elem => `"${elem}"`).join(",\n")}
                    ],
                    "module": [
                        ${addMod.join(",\n")}
                    ],
                    "variable": [
                        {
                            "name": "du",
                            "value": "${JSON.parse(fs.readFileSync("./package.json", { encoding: "utf-8" })).version}"
                        }
                    ],
                    "type": "${type}"
                }
                `);
                for (var i = 0; i < calllist.length; i++) {
                    fs.writeFileSync(path.join(main, calllist[i]), ``)
                }
            } else {
                let type;
                let job = true;
                while (job) {
                    let typ = prompt(chalk.white.bold("Specify the du language type: ")).replace(/^\s+|\s+$|\s/gm, "");

                    switch (typ) {
                        case "DuScript":
                            typ = typ;
                            job = false;
                            break;
                        case "DuScharp":
                            typ = typ;
                            job = false;
                            break;
                        default:
                            console.error(chalk.red.bold("It is not a type of du language."))
                            break;
                    }
                }
                fs.writeFileSync(path.join(main, "Door.json"), `
                {
                    "call": [
                        ${calllist.map(elem => `"${elem}"`).join(",\n")}
                    ],
                    "variable": [
                        {
                            "name": "du",
                            "value": "${VERSION}"
                        }
                    ],
                    "type": "${type}"
                }
                `);
                for (var i = 0; i < calllist.length; i++) {
                    fs.writeFileSync(path.join(main, calllist[i]), ``)
                }
            }
        }
    } else if (arg[2] == "run") {
        let src = arg.slice(3).join(" ");

        if (/\.[^.]+$/.test(src)) {
            let file = fs.readFileSync(src, { encoding: "utf-8" }).split(";")[0].replace(/^\s+|\s+$|\s/gm, "");
            if (file == "//duscript") {

                if (fs.existsSync("./src/dus.src")) {
                    let sr = fs.readFileSync("./src/dus.src", { encoding: "utf-8" });
                    let v = JSON.parse(fs.readFileSync(path.join(sr, "package.json"))).version;
                    console.log(chalk.white.bold("DuScript@" + v + ": \n"));
                } else {
                    console.log(chalk.white.bold("DuScript: \n"));
                }

                exec("where dus", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`${error.message}`);
                        return;
                    }

                    if (stderr || stdout.includes('Could not find files')) {
                        if (fs.existsSync("./save/dus.src")) {
                            exec(`node ${path.join(fs.readFileSync("./src/dus.src", { encoding: "utf-8" }), "duScript.js")} ${src}`, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`${error.message}`);
                                    return;
                                }

                                if (stderr) {
                                    console.error(`${stderr}`);
                                    return;
                                }

                                console.log(stdout);
                            });
                        } else {
                            console.error(chalk.red.bold("You didn't write down the DuScript storage path, you can do it with the command:"));
                            console.error("         ", chalk.white.underline("du request"))
                        }
                    } else {
                        exec(`dus ${src}`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`${error.message}`);
                                return;
                            }

                            if (stderr) {
                                console.error(`${stderr}`);
                                return;
                            }

                            console.log(stdout);
                        });
                    }
                });

            } else if (file == "//duscharp") {
                console.log(chalk.blue.bold("This feature is still under development."))
            } else {
                console.error(chalk.red.bold("To launch the file, you must specify the type of language du. \nExample:\n     // duscript;"))
            }
        } else {
            if (!/\\$/gm.test(src)) {
                src += "\\";
            }
            if (fs.existsSync(path.join(src, "Door.json"))) {
                let door = JSON.parse(fs.readFileSync(path.join(src, "Door.json")));

                if (door.type) {
                    if (door.type == "DuScript") {

                        if (fs.existsSync("./src/dus.src")) {
                            let sr = fs.readFileSync("./src/dus.src", { encoding: "utf-8" });
                            let v = JSON.parse(fs.readFileSync(path.join(sr, "package.json"))).version;
                            console.log(chalk.white.bold("DuScript@" + v + ": \n"));
                        } else {
                            console.log(chalk.white.bold("DuScript: \n"));
                        }

                        exec("where dus", (error, stdout, stderr) => {
                            if (error) {
                                console.error(`${error.message}`);
                                return;
                            }

                            if (stderr || stdout.includes('Could not find files')) {
                                if (fs.existsSync("./save/dus.src")) {
                                    exec(`node ${path.join(fs.readFileSync("./src/dus.src", { encoding: "utf-8" }), "duScript.js")} ${src}`, (error, stdout, stderr) => {
                                        if (error) {
                                            console.error(`${error.message}`);
                                            return;
                                        }

                                        if (stderr) {
                                            console.error(`${stderr}`);
                                            return;
                                        }

                                        console.log(stdout);
                                    });
                                } else {
                                    console.error(chalk.red.bold("You didn't write down the DuScript storage path, you can do it with the command:"));
                                    console.error("         ", chalk.white.underline("du request"))
                                }
                            } else {
                                exec(`dus ${src}`, (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`${error.message}`);
                                        return;
                                    }

                                    if (stderr) {
                                        console.error(`${stderr}`);
                                        return;
                                    }

                                    console.log(stdout);
                                });
                            }
                        });

                    } else if (door.type == "DuScharp") {
                        console.log(chalk.blue.bold("This feature is still under development."))
                    } else {
                        console.error(chalk.red.bold("To launch the file, you must specify the type of language du. \nExample:\n     \"type\": \"DuScript\""))
                    }
                } else {
                    console.error(chalk.red.bold("There must be a type field in the Door.json file to run."));
                }
            } else {
                console.error(chalk.red.bold("To start the directory, it must contain the Door.json file."));
            }
        }
    } else if (arg[2] == "install") {
        exec(`npm install duscript -g`, (error, stdout, stderr) => {
            if (error) {
                console.error(`${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`${stderr}`);
                return;
            }

            console.log(stdout);
        });
    } else if (arg[2] == "update") {
        exec(`npm update -g duscript`, (error, stdout, stderr) => {
            if (error) {
                console.error(`${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`${stderr}`);
                return;
            }

            console.log(stdout);
        });
    } else {
        console.error(chalk.red.bold("Unknown command \"" + arg[2] + "\"."));
    }
} else {
    // README.MDk
}
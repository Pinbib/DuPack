# DuPack

Install: 

``` npm install -g dupack ```

DuPack - It's like a package manager (in the future) also a program that can speed up the creation of "du" programs.

There are six commands in total: request, version, new, run, install, update.

After installation, go to the directory where it was installed and find the du.exe file there and run it, you should have a du.bat file created (if errors occur, run the file again). move du.bat to the C:/Windows/System32 folder (starting with version DuScript@0.3.0 the file created by DuScriptWindows.exe was renamed from du.bat to dus.bat if you use a younger version of DuScript, just delete the old file du .bat and put a new one), after you have transferred the file, go to the terminal and execute the command ``` du version ```if there are errors, read everything again and make sure that you did everything correctly.

# update

``` du update ```

All installed du languages will be updated.

# install

``` du install ```

All du languages will be installed.

# versions

``` du version ```

Will output the DuPack version.

# request

``` du request ```

I write down all the necessary data for the quick operation of the program (recommended before using all the following commands).

# new

``` du new ```

Creates a new project for Door.json.

Now there are only two types of du:

For Door.json, you need to set either DuScript or DuScharp in the field type.

If the file itself is launched and not the directory, to specify the type, you need to add either ``` // duscript; ``` or ``` // duscharp; ``` in the first line.

# run

``` du run [src] ``` 

src - The directory or file to be launched. 

For correct work, the du type must be specified (how to do this, see the "new" command).
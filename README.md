# Capstone-Spring-2020

API DOCUMENTATION: https://documenter.getpostman.com/view/10563873/SzfAxR1m?version=latest#d4dd41de-de7b-4ed8-8359-7f090569edab

Required - NodeJS, VSCode

Required VSCode Extensions - Live Server, Live Sass Compiler

Starting setups:

1. Inside VSCode's terminal, run "npm install" to install the the dependenacies. 

2. Run "npm run build" to create bundled js and dist folder.

3. Make a new folder called ".vscode" and create a new file called "settings.json".

4. Paste the below into the file.

```javascript
{
    "liveSassCompile.settings.formats":[
       {
           "format": "expanded",
           "extensionName": ".css",
           "savePath": "/src/css"
       },
       {
           "extensionName": ".css",
           "format": "compressed",
           "savePath": "/dist/css"
       }
   ],
   "liveSassCompile.settings.excludeList": [
      "**/node_modules/**",
      ".vscode/**"
   ],
   "liveSassCompile.settings.generateMap": true,
   "liveSassCompile.settings.autoprefix": [
       "> 1%",
       "last 5 versions"
   ]
}
```
4. Turn on Live Sass Compiler and save in any scss file to create the compiled css in the css folders.

Development Scripts: 

SCSS: No scripts, just use the 2 extensions.

JS: Run "npm run watch:js" for development mode and run "npm run build:js" to bundle js files into one file.

Node: Run "node server.js" and type "localhost:8000/" into url to see the site on a web server.


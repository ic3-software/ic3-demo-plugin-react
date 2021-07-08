#!/usr/bin/env node

const fs = require('fs');
const AdmZip = require('adm-zip');

console.log(__dirname)

const dist = __dirname + "/../dist";

if (!fs.existsSync(dist)) {
    console.error("MISSING built /dist directory :" + dist);
    process.exit(-1);
}

const zip = __dirname + "/../kit";

console.log("rm -rf " + zip);

fs.rmSync(zip, {recursive: true, force: true});

const zip = new AdmZip();

zip.addLocalFolder(dist);
zip.writeZip(zip + "/kit.zip");

console.log("done @ " + zip + "/kit.zip");

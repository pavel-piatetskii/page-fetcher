// ---------- External modules ----------
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// ------------- CLI-input -------------
const url = process.argv[2];
const localPath = process.argv[3];


// ------ Main save file handler ----
const callbackSaveFile = function(data, path) {

  if (!pathValid(path)) {
    console.log('Path invalid! Application stopped.')
    process.exit();
  }
  if (fs.existsSync(path)) {
    rl.question('File already exists. Overwrite? [Y] ', (answer) => { 
      if (answer === 'Y' || answer ==='y') { 
        rl.close();
        saveFileYes(data, path);
      } else {
      rl.close()
      console.log('Application stopped');
      process.exit();
      }
    })
  } else {
    saveFileYes(data, path)
  }
};


// ------- Path validator ---------
const pathValid = function (path) {
  const arr = path.split('/');
  if (arr === path) return false; // check if it is path at all

  arr.pop(); // make a dir from path to filename
  const dir = arr.join('/');
  // console.log(dir)
  return (dir === '.' || fs.existsSync(dir)) ? true : false; // check if dir exists
  
}


// ---- Actual function to save a file ---
const saveFileYes = function(data, path) {
  fs.writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(`Downloaded and saved ` +
                `${data.length} bytes to ${path}.`);
    
    process.exit();
  })
};


// ----- Try to request a web-page ---------
const getPage = function(url, callback) {

  request(url, (error, response, body) => {

  if (response && response.statusCode === 200) {
    callback(body, localPath)

  } else if (!response) {
    console.log('You entered an invalid URL! Application stopped')
    process.exit();
  } else {
    console.log(`Error ${response.statusCode} '${response.statusMessage}'`);
    process.exit();
  }
});
}

// console.log(fs.existsSync('./'))

getPage(url, callbackSaveFile)
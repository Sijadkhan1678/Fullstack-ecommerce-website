// process.env["NODE_CONFIG_DIR"] = __dirname;
// const config = require("config")

// const splitPath = (path) => path.split('/')

// module.exports.get = (configPath) => {
//     let currentConfig;
//     const pathArray = splitPath(configPath);
//     const levelDepth = pathArray.length;

//     console.log(pathArray)
// // ["dbConfig","paasword"]

//         let i = 0
        
//         console.log(path)
//         configObject = config[path]
//         while (i < levelDepth) {
            
//             console.log('path',i,pathArray[i])
//             const path = pathArray[i];
//            configObject = pathArray[i];
//             // console.log('currentConfig',i,currentConfig)
//             i++
//         }


//     return currentConfig
// }

process.env["NODE_CONFIG_DIR"] = __dirname;
const config = require("config");

const splitPath = (path) => path.split('/');

module.exports.get = (path) => {
    if (!path) {
        throw new Error('Config path is required');
    }
    
    const segments = splitPath(path);
    let current = config;
    
    for (let i = 0; i < segments.length; i++) {
        const key = segments[i];
        
        if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
            current = current[key];
        } else {
            throw new Error(`Config path "${path}" not found. Missing: "${key}"`);
        }
    }
    
    return current;
};
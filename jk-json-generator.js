// Author: Jobin Kurian
// Email: ti.jobinkurian@gmail.com

var fs = require('fs');
var path = require('path');
var dummyjson = require('dummy-json');
var jsonlint = require("jsonlint");

var input_dir = "input_template";
var output_dir = "json_output";
var output_extenstion = ".json";
var template_extenstion = ".jk";

if (!fs.existsSync(input_dir)){
    console.log("\n\nCould not find the templates folder. \n\nPlease create folder named '" + input_dir + "' and add some templates with '" + template_extenstion + "' extention for converstion.\n\n");
    process.exit(1);
}
if (!fs.existsSync(output_dir)){
    fs.mkdirSync(output_dir);
}

// Getting all the files inside the input directory.
var all_files_array = getAllTemplateFiles(input_dir);

// Taversing through the input_dir
all_files_array.forEach(function (templateFile, index) {

    var	template_file_data = fs.readFileSync(templateFile, {encoding : 'utf8'});
	var converted_JSON_text = dummyjson.parse(template_file_data);

    // Checking if there is an error in the generated JSON.
    // If there is error that means the original template is having error.
    try {
        jsonlint.parse(converted_JSON_text);

        writeToFile(templateFile, converted_JSON_text);
        console.log('Converting %d/%d', index + 1, index + 1);
        if (all_files_array.length - 1 == index) {
            console.log("Completed Converting All Files To JSON");
        };

    } catch (err) {
        console.log("\n\nThere is an error in the template '" + templateFile + "'\nPlease correct the below error and re-run the converstion");
        console.log(err + "\n\n");  
    
    }    
});

// Function to file the json data to the file
function writeToFile(templateFile, converted_JSON_text) {

        // This will remove the filename 
        var path_without_file = path.dirname(templateFile);
        var parentFolder = null;

        // Checking if the path has subdirectory 
        if (path_without_file.indexOf("/") != -1) {
            parentFolder = path_without_file.substr(path_without_file.indexOf('/'), path_without_file.length); 
        }
        
        // Creating the finale folder directory where the files will be saved.
        var output_folderpath = null
        if (parentFolder) {
            output_folderpath = output_dir + parentFolder + '/';
        }
        else {
            output_folderpath = output_dir + '/';
        }

        // Creating the folder structure to save the file.
        if (!fs.existsSync(output_folderpath)){
            fs.mkdirSync(output_folderpath);
        }

        // The output file path where the JSON will be saved.
        var output_filepath = output_folderpath + path.basename(templateFile, template_extenstion) + output_extenstion;

        // Writing the JSON data to the file.
        fs.writeFile(output_filepath, converted_JSON_text, function(err) {
           if(err) {
        	  console.log("Error ");
        	   return console.log(err);
        }
	});
}

// Function to get all the templates inside the input directory
function getAllTemplateFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getAllTemplateFiles(name, files_);
        } else {
            if (path.extname(name) == template_extenstion) {
                files_.push(name);
            }
        }
    }
    if (files_.length == 0) {
    	console.log("\n\nThe Template Folder Seems To Be Empty :( \n\nPlease add some templates with '" + template_extenstion + "' extention for converstion.\n\n");
        process.exit(1);
    };
    return files_;
}


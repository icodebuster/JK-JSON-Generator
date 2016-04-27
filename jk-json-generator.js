// Authon: Jobin Kurian
// Email: ti.jobinkurian@gmail.com

var fs = require('fs');
var path = require('path');
var dummyjson = require('dummy-json');

var input_dir = "input_template";
var output_dir = "json_output";
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
	var	output_filepath = output_dir + '/' + path.basename(templateFile, template_extenstion) + '.json' ;
	writeToFile(output_filepath, converted_JSON_text);
	
	console.log('Converting %d/%d', index + 1, index + 1);
	if (all_files_array.length - 1 == index) {
		console.log("Completed Converting All Files To JSON");
	};
});

// Function to file the json data to the file
function writeToFile(filepath, converted_JSON_text) {
	fs.writeFile(filepath, converted_JSON_text, function(err) {
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
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    if (files_.length == 0) {
    	console.log("\n\nThe Template Folder Seems To Be Empty :( \n\nPlease add some templates with '" + template_extenstion + "' extention for converstion.\n\n");
        process.exit(1);
    };
    return files_;
}
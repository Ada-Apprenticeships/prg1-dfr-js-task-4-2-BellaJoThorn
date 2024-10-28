const fs = require("fs");

function fileExists(filename) {
  return !fs.existsSync(filename) ? false : true
}

function validNumber(value) {
  return /^-?\d*\.?\d+$/.test(value.toString())
}

function dataDimensions(dataframe) {
// returns a list [rows (int), cols (int)]

let rows = -1
let cols = -1

if (!(dataframe == undefined)) {

  if (dataframe.length > 0) {
    rows = dataframe.length;
  }

  if (!Array.isArray(dataframe[0])) { 
    cols = -1;
  } else {cols = dataframe[0].length}

}

console.log([rows, cols])
return [rows, cols]

}

function findTotal(dataset) {
 
  let total = 0;

  // Check if the dataset is an array and not empty
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return 0; // Invalid dataset
  }

  for (let i = 0; i < dataset.length; i++) {
    // Check if each element is a valid number and not an array
    if (validNumber(dataset[i]) && !Array.isArray(dataset[i])) { 
      total += parseFloat(dataset[i]);
    } 
  }

  console.log(total);
  return total;

}

function calculateMean(dataset) {
    // returns a float or false

    let validNums = []
    let amount = 0
    let total = 0
    let average = 0
  
    for (let i = 0; i < dataset.length; i++) {
       if (validNumber(dataset[i])) {
        validNums.push(parseFloat(dataset[i]))
       }
    }
  
    for (let i = 0; i < validNums.length; i++) {
      amount ++
    }
  
    validNums.forEach(Number => {
      total = total + Number
    });
  
    average = total / amount
    
    console.log(total)
    console.log(amount)
    if (!validNumber(average)){
      average = 0
    }
    console.log(average)
    
   return average
}

function calculateMedian(dataset) {

  // return float or false 

  let validNums = []
  let median = 0

  for (let i = 0; i < dataset.length; i++) {
    if (validNumber(dataset[i])) {
     validNums.push(parseFloat(dataset[i]))
    }
  }

  console.log(validNums.sort(function(a, b){return a - b}))

  let odd = false
  let even = false

  if ((validNums.length)% 2 == 0){
    even = true
  } else {
    odd = true
  }

  if (odd === true){
    median = validNums[((validNums.length - 1) / 2)]
  }

  if (even === true) {
    median = (validNums[(validNums.length)/2] + validNums[((validNums.length)/2) -1]) / 2
  }
  
  console.log(median)

 if (validNums != ""){
  return median
 } else {
  return 0
 }
}

function convertToNumber(dataframe, col) {
 // returns an integer, which is the number that were  converted to floats.
 let integer = 0

 for (let i = 0; i < dataframe.length; i++) {
  if (validNumber(dataframe[i][col]) && typeof(dataframe[i][col]) == 'string') {
    dataframe[i][col] = parseFloat(dataframe[i][col])
    integer ++
  }
 }

 console.log(integer)
 return integer
}

function flatten(dataframe) {
// returns a dataset (a flattened dataframe)

let newArray = []

if (dataframe[0].length == 1){
 for (let i = 0; i < dataframe.length; i++) { 
   for (let j = 0; j < dataframe[i].length; j++) { 
     newArray.push(dataframe[i][j]);
   }
  }
 }

 console.log(newArray)
 return(newArray)

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {

  if (!fs.existsSync(csvFile

  )) {
    return [[], -1, -1]; 
   } else {
    let totalColumns = 0;
  const newArray = [];
  const delimiter = ",";


    const data = fs.readFileSync(csvFile, { encoding: "utf-8", flag: 'r' });
    const rows = data.split(/\n/);
    const totalRows = rows.length;

    if (rows.length > 0) {
      totalColumns = rows[0].split(delimiter).length;
    }

    for (let i = 0; i < rows.length; i++) {
      if (!ignoreRows.includes(i)) {
        const columns = rows[i].split(delimiter);
        const newRow = [];
        for (let j = 0; j < columns.length; j++) {
          if (!ignoreCols.includes(j)) {
            newRow.push(columns[j].trim()); 
        }
      }
      if (newRow.length > 0) { 
        newArray.push(newRow);
      }
}
    }

  return [newArray, totalRows, totalColumns];

}}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {

  const newArray = [];

  for (let i = 0; i < dataframe.length; i++) {
    if ( (pattern === '*' && columnIndex < dataframe[i].length) || dataframe[i][columnIndex] === pattern) { 
      let newRow = [];
      const colsToInclude = exportColumns.length > 0 ? exportColumns : dataframe[i].map((_, j) => j);
      for (let j = 0; j < colsToInclude.length; j++) {
        const columnIndex = colsToInclude[j];
        if (dataframe[i][columnIndex] !== undefined) {
          newRow.push(dataframe[i][columnIndex]);
        }
      }
      newArray.push(newRow);
    }
  }

  return newArray;
}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};
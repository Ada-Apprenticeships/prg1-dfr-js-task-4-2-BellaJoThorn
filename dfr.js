const fs = require("fs");

function fileExists(filename) {

  return !fs.existsSync(filename) ? false : true

}

function validNumber(value) {

  return /^-?\d*\.?\d+$/.test(value.toString())

}

function dataDimensions(dataframe) {

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
  
  return [rows, cols]

}

function findTotal(dataset) {
  
  let total = 0;
  
  if (!Array.isArray(dataset) || dataset.length === 0) {
    return 0
  }
  
  for (let i = 0; i < dataset.length; i++) {
    if (validNumber(dataset[i]) && !Array.isArray(dataset[i])) { 
      total += parseFloat(dataset[i]);
    } 
  }
  
  return total;

}

function calculateMean(dataset){

  let total = 0
  let amount = 0

  for (const numbers of dataset) {
    if (validNumber(numbers)){
      total += parseFloat(numbers)
      amount ++
    }
  }

  return (amount > 0 ? total / amount : 0)

}

function calculateMedian(dataset) {
  
  const validNumbers = dataset.filter(validNumber).map(parseFloat);
  
  if (validNumbers.length === 0) {
    return 0;
  }
  
  validNumbers.sort((a, b) => a - b)

  const midIndex = Math.floor(validNumbers.length / 2);

  return validNumbers.length % 2 === 0
    ? (validNumbers[midIndex - 1] + validNumbers[midIndex]) / 2
    : validNumbers[midIndex];

}

function convertToNumber(dataframe, col) {
  
  let count = 0
  
  for (let i = 0; i < dataframe.length; i++) {
    if (validNumber(dataframe[i][col]) && typeof(dataframe[i][col]) == 'string') {
      dataframe[i][col] = parseFloat(dataframe[i][col])
      count ++
    }
  }
  
  return count

}

function flatten(dataframe) {
  
  let newArray = []
  
  if (dataframe[0].length == 1){
    for (let i = 0; i < dataframe.length; i++) { 
      for (let j = 0; j < dataframe[i].length; j++) { 
        newArray.push(dataframe[i][j]);
      }
    }
  }
  
  return(newArray)

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {
  
  if (!fileExists(csvFile)){
    return [[], -1, -1]; 
  }
  
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

}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  
  return dataframe.filter(row => columnIndex === '*' || (pattern === '*' && columnIndex < row.length) || row[columnIndex] === pattern).map(row => {
    const columnsToInclude = exportColumns.length > 0 ? exportColumns : row.map((_, j) => j);
    return columnsToInclude.map(j => row[j]).filter(val => val !== undefined);
  });

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
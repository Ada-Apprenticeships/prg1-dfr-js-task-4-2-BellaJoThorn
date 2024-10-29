const fs = require("fs");

function fileExists(filename) {

  return !fs.existsSync(filename) ? false : true

}

function validNumber(value) {

  return /^-?\d*\.?\d+$/.test(value.toString())

}

function dataDimensions(dataframe) {

  //Initialize rows and cols to -1, indicating an invalid or empty dataframe
  let rows = -1
  let cols = -1
  
  //Check if the dataframe is defined and not empty
  if (!(dataframe == undefined)) {
    if (dataframe.length > 0) {
      //If it is not empty then it sets the number of rows
      rows = dataframe.length;
    }
    
    //Check if the first element of the dataframe is an array itself
    if (!Array.isArray(dataframe[0])) { 
      //If the first element is not an array, it's not a valid 2D array, so cols remain -1
      cols = -1;
      //Sets the number of columns based on the length of the first row
    } else {cols = dataframe[0].length}
  }
  
  return [rows, cols]

}

function findTotal(dataset) {
  
  let total = 0;
  
  //Check if the input is a valid array and not empty
  if (!Array.isArray(dataset) || dataset.length === 0) {
    //If not a valid array or it is empty then it returns 0
    return 0
  }
  
  //Iterates through each elemnent in the data set 
  for (let i = 0; i < dataset.length; i++) {
    //Checks if the current element is a valid number and not an array itself
    if (validNumber(dataset[i]) && !Array.isArray(dataset[i])) { 
      //If it is valid then it adds it's value to the total
      total += parseFloat(dataset[i]);
    } 
  }
  
  return total;

}

function calculateMean(dataset){

  let total = 0
  let amount = 0

  //Filters the data set in to a new array by valids numbers and calls the pass float function on each element
  const validNumbers = dataset.filter(validNumber).map(parseFloat)

  total = findTotal(validNumbers)

  amount = validNumbers.length

  //If amount has a value greater than 0 it calculates the average, if not returns 0
  return (amount > 0 ? total / amount : 0)

}

function calculateMedian(dataset) {
  
  //Filters the data set in to a new array by valids numbers and calls the pass float function on each element
  const validNumbers = dataset.filter(validNumber).map(parseFloat);
  
  //If there is no data then returns 0
  if (validNumbers.length === 0) {
    return 0;
  }
  
  //Sorts valid numbers in ascending order 
  validNumbers.sort((a, b) => a - b)

  //Finds the middle index of the valid numbers data
  const midIndex = Math.floor(validNumbers.length / 2);

  //Finds whether there is an odd or even amount of elements
  return validNumbers.length % 2 === 0
    //If an even number it finds the mid value between the two middle values
    ? (validNumbers[midIndex - 1] + validNumbers[midIndex]) / 2
    //If an odd number the mid index is the median
    : validNumbers[midIndex];

}

function convertToNumber(dataframe, col) {
  
  let count = 0
  
  for (let i = 0; i < dataframe.length; i++) {
    //Checks if the value in the specified column and current row is valid and a string
    if (validNumber(dataframe[i][col]) && typeof(dataframe[i][col]) == 'string') {
      //If both true then it runs the parse float function on the element
      dataframe[i][col] = parseFloat(dataframe[i][col])
      //Increments the count
      count ++
    }
  }
  
  return count

}

function flatten(dataframe) {
  
  let newArray = []
  
  //Checks that the first row has only one column
  if (dataframe[0].length == 1){
    //If true, iterates through each row
    for (let i = 0; i < dataframe.length; i++) { 
      //Iterates through the column in the row
      for (let j = 0; j < dataframe[i].length; j++) { 
        //Pushes the element in to the new array
        newArray.push(dataframe[i][j]);
      }
    }
  }
  
  return(newArray)

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {
  
  //Returns [[], -1, -1] if the file passed through does not exist
  if (!fileExists(csvFile)){
    return [[], -1, -1]; 
  }
  
  let totalColumns = 0;
  const newArray = [];
  const delimiter = ",";

  //Reads the data from the passed file and splits it in to an array by line
  const data = fs.readFileSync(csvFile, { encoding: "utf-8", flag: 'r' });
  const rows = data.split(/\n/);

  //Finds the total number of rows in the original array
  const totalRows = rows.length;

  if (rows.length > 0) {
    //Finds the number of columns in the original array based on the first row
    totalColumns = rows[0].split(delimiter).length;
  }

  for (let i = 0; i < rows.length; i++) {
    //Checks whether the current row index is part of the ignoredRows array 
    if (!ignoreRows.includes(i)) {
      //If not ignore then it splits the elements of the column by the delimiter 
      const columns = rows[i].split(delimiter);
      const newRow = [];
      for (let j = 0; j < columns.length; j++) {
        //Checks whether the current column index is part of the ignoreCols array
        if (!ignoreCols.includes(j)) {
          //If not ignore then it pushes it in to the newRow array
          newRow.push(columns[j].trim()); 
        }
      }
      //Checks that the new row array is not empty
      if (newRow.length > 0) { 
        //If not then pushes it in to the new array
        newArray.push(newRow);
      }
    }
  }

  return [newArray, totalRows, totalColumns];

}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  
  //Filters the dataframe by the columnIndex and pattern provided and maps the filtered rows to extract the desired columns
  return dataframe.filter(row => columnIndex === '*' || (pattern === '*' && columnIndex < row.length) || row[columnIndex] === pattern).map(row => {
    //Determine which columns to include by using the exportColumns, if exportColumns is empty it takes all columns from the current row
    const columnsToInclude = exportColumns.length > 0 ? exportColumns : row.map((_, j) => j);
    //Map the columnsToInclude to extract the corresponding values from the current row
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
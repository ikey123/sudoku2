// script.js
// 生成数独棋盘

function generateSudokuBoard() {
  // 数独棋盘的初始状态，0 表示空格
  var initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  var boardContainer = document.querySelector('.sudoku-board');

  // 渲染数独棋盘到网页上
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var cell = document.createElement('input');
      cell.type = 'text';
      cell.classList.add('sudoku-cell');
      if (initialBoard[i][j] !== 0) {
        cell.value = initialBoard[i][j];
        cell.disabled = true; // 固定初始数字，禁止修改
      }
      boardContainer.appendChild(cell);
    }
  }
}

// 检查数独解答
function checkSudokuSolution() {
  var board = document.querySelectorAll('.sudoku-cell');
  var userSolution = [];
  // 将用户输入的解答转换为二维数组
  for (var i = 0; i < 9; i++) {
    userSolution.push([]);
    for (var j = 0; j < 9; j++) {
      var value = parseInt(board[i * 9 + j].value);
      if (isNaN(value) || value < 1 || value > 9) {
        alert('Please fill in valid numbers from 1 to 9.');
        return;
      }
      userSolution[i].push(value);
    }
  }
  // 检查每行、每列和每个小九宫格是否符合数独规则
  if (checkRows(userSolution) && checkColumns(userSolution) && checkSubgrids(userSolution)) {
    alert('Congratulations! You solved the Sudoku puzzle.');
  } else {
    alert('Sorry, the solution is not correct.');
  }
}

// 检查每行是否符合数独规则
function checkRows(board) {
  for (var i = 0; i < 9; i++) {
    if (!isValidSet(board[i])) {
      return false;
    }
  }
  return true;
}

// 检查每列是否符合数独规则
function checkColumns(board) {
  for (var j = 0; j < 9; j++) {
    var column = [];
    for (var i = 0; i < 9; i++) {
      column.push(board[i][j]);
    }
    if (!isValidSet(column)) {
      return false;
    }
  }
  return true;
}

// 检查每个小九宫格是否符合数独规则
function checkSubgrids(board) {
  for (var i = 0; i < 9; i += 3) {
    for (var j = 0; j < 9; j += 3) {
      var subgrid = [];
      for (var x = i; x < i + 3; x++) {
        for (var y = j; y < j + 3; y++) {
          subgrid.push(board[x][y]);
        }
      }
      if (!isValidSet(subgrid)) {
        return false;
      }
    }
  }
  return true;
}

// 检查 1-9 的数字集合是否合法（即没有重复数字）
function isValidSet(arr) {
  var set = new Set(arr);
  set.delete(0); // 删除空格
  return set.size === arr.filter(x => x !== 0).length;
}

// 解决数独
function solveSudoku() {
  var board = document.querySelectorAll('.sudoku-cell');
  var userSolution = [];
  // 将用户输入的解答转换为二维数组
  for (var i = 0; i < 9; i++) {
    userSolution.push([]);
    for (var j = 0; j < 9; j++) {
      var value = parseInt(board[i * 9 + j].value);
      if (isNaN(value) || value < 1 || value > 9) {
        alert('Please fill in valid numbers from 1 to 9.');
        return;
      }
      userSolution[i].push(value);
    }
  }
  // 调用数独求解算法
  if (solveSudokuHelper(userSolution)) {
    // 将解答渲染到网页上
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        board[i * 9 + j].value = userSolution[i][j];
      }
    }
  } else {
    alert('This Sudoku puzzle does not have a valid solution.');
  }
}


// 数独求解算法
function solveSudokuHelper(board) {
  var emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    return true; // 数独已解决
  }
  var row = emptyCell[0];
  var col = emptyCell[1];
  for (var num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudokuHelper(board)) {
        return true;
      }
      board[row][col] = 0; // 回溯
    }
  }
  return false; // 无解
}

// 找到未填写的单元格
function findEmptyCell(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null; // 数独已解决
}

// 检查数字是否可以放置在指定位置
function isValidMove(board, row, col, num) {
  for (var i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false; // 同一行或同一列已经有相同的数字
    }
  }
  var subgridRow = Math.floor(row / 3) * 3;
  var subgridCol = Math.floor(col / 3) * 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[subgridRow + i][subgridCol + j] === num) {
        return false; // 小九宫格中已经有相同的数字
      }
    }
  }
  return true;
}

// 清除数独棋盘
function clearSudokuBoard() {
  var board = document.querySelectorAll('.sudoku-cell');
  for (var i = 0; i < board.length; i++) {
    board[i].value = ''; // 清空单元格
    board[i].disabled = false; // 恢复可编辑状态
  }
}

// 绑定按钮事件
document.getElementById('check-btn').addEventListener('click', checkSudokuSolution);
document.getElementById('solve-btn').addEventListener('click', solveSudoku);
document.getElementById('clear-btn').addEventListener('click', clearSudokuBoard);

// 初始化数独棋盘
generateSudokuBoard();
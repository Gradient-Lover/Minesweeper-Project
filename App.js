import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const initializeBoard = (rows, cols, mines) => {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));

  let placedMines = 0;

  while (placedMines < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (board[row][col] !== "X") {
      board[row][col] = "X";
      placedMines++;
    }
  }
  return board;
};

const MinesweeperApp = () => {
  const rows = 5;
  const cols = 5;
  const mines = 5;

  const [board, setBoard] = useState(initializeBoard(rows, cols, mines));
  const [revealed, setRevealed] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  useEffect(() => {
    if (checkForGameOver(revealed)) {
      Alert.alert("Game over :(", "You hit a mine!!", [
        { text: "New game", onPress: resetGame },
      ]);
    }
  }, [revealed]);

  const checkForGameOver = (revealedBoard) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j] === "X" && revealedBoard[i][j]) {
          return true;
        }
      }
    }
    return false;
  };

  const handlePress = (row, col) => {
    if (board[row][col] === "X") {
      Alert.alert("Game over :(", "You hit a mine!!", [
        { text: "New game", onPress: resetGame },
      ]);
    } else {
      const updatedRevealed = [...revealed];
      updatedRevealed[row][col] = true;
      setRevealed(updatedRevealed);

      if (checkForVictory(updatedRevealed)) {
        Alert.alert("Congrats!!", "You won!", [
          { text: "New game", onPress: resetGame },
        ]);
      }
    }
  };

  const checkForVictory = (revealedBoard) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j] !== "X" && !revealedBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const resetGame = () => {
    setBoard(initializeBoard(rows, cols, mines));
    setRevealed(Array.from({ length: rows }, () => Array(cols).fill(false)));
    Alert.alert("Reset successful!");
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <TouchableOpacity
            key={colIndex}
            style={[
              styles.cell,
              revealed[rowIndex][colIndex] && styles.revealedCell,
            ]}
            onPress={() => handlePress(rowIndex, colIndex)}
          >
            {revealed[rowIndex][colIndex] ? (
              <Text style={styles.cellText}>
                {cell === "X" ? "💣" : countMines(rowIndex, colIndex)}
              </Text>
            ) : (
              <Text style={styles.cellText}>{""}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const countMines = (row, col) => {
    let count = 0;
    for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
      for (
        let j = Math.max(0, col - 1);
        j <= Math.min(cols - 1, col + 1);
        j++
      ) {
        if (board[i][j] === "X") {
          count++;
        }
      }
    }
    return count;
  };

  return (
    <View style={styles.container}>
      {renderBoard()}
      <Button title="New game" onPress={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  revealedCell: {
    backgroundColor: "lightgray",
  },
  cellText: {
    fontSize: 18,
  },
});

export default MinesweeperApp;

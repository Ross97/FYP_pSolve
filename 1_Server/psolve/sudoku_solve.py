# DESCRIPTION: Program to solve a sudoku using a backtracking algorithm.
import copy
import hashlib


# Backtracking recursive sudoku solver
# Solving steps
#   0. Check if a cached solution already exists, return it if so
#   1. Find a blank cell
#   2. Try a digit for that cell (digits 1 to 9 inclusive)
#   3. Check the digit is allowed (not in current row or column or box)
#   4. Repeat 1-3 until an issue occurs
#   5. When an issue occurs, backtrack to step 2 and try another digit
#   6. Cache the solution


def test_cases():
    """
    Test cases to ensure program works as intended
        1. a valid sudoku puzzle (returns a solution)
        2. a copy of an already solved sudoku puzzle (returns a hashed solution)
        3. an invalid sudoku puzzle (returns None)
    """

    valid_sudoku = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 0, 9]
    ]

    copied_valid_sudoku = copy.deepcopy(valid_sudoku)

    invalid_sudoku = [
        [5, 5, 5, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 0, 9]
    ]

    # Should return a valid solution
    valid = get_solution(valid_sudoku)
    print('valid', valid, '\n')

    # Should return a valid hashed solution (same as before)
    valid_copy = get_solution(copied_valid_sudoku)
    print('valid_copy', valid_copy, '\n')

    # Should return None
    invalid = get_solution(invalid_sudoku)
    print('invalid', invalid, '\n')


def get_blank_cell(matrix):
    """
    Finds a blank cell
    Returns row, col of blank cell
    Returns None if no blank cells exist
    """
    for row in range(9):
        for col in range(9):
            if matrix[row][col] == 0:
                return row, col
    return None


def digit_is_allowed(matrix, digit, location):
    """
    Check the row, column, and box for the digit
    Returns False if not valid
    Otherwise returns True
    """

    row, col = location

    # Check row
    for i in range(9):
        if matrix[row][i] == digit and col != i:
            return False

    # Check col
    for i in range(9):
        if matrix[i][col] == digit and row != i:
            return False

    # Check box
    boxrow = int(row / 3)
    boxcol = int(col / 3)
    for i in range(boxrow * 3, boxrow * 3 + 3):
        for j in range(boxcol * 3, boxcol * 3 + 3):
            if matrix[i][j] == digit and location != (i, j):
                return False

    return True


def solve_sudoku(matrix):
    """ Solves the sudoku recursively (backtracking) 
        Returns True or False
    """

    # Find a blank cell
    # No blank cells means sudoku is solved
    blank_cell = get_blank_cell(matrix)
    if not blank_cell:
        return True
    row, col = blank_cell

    # Try each digit in the cell
    # If digit is valid, add it to the board and recursively call solve_sudoku()
    # Reset the value if solve_sudoku returns False (backtracking)
    for digit in range(1, 10):
        if digit_is_allowed(matrix, digit, blank_cell):
            matrix[row][col] = digit
            if solve_sudoku(matrix):
                return True
            matrix[row][col] = 0

    return False


def get_solution(matrix):
    """
    Returns a solution as a 9*9 list if a solution is found
    Otherwise returns None
    """

    # Convert blank spaces to 0 and cast all elements as digits
    for i in range(9):
        for j in range(9):
            if matrix[i][j] == '':
                matrix[i][j] = 0
            matrix[i][j] = int(matrix[i][j])

    # Check input is valid
    for i in range(9):
        for j in range(9):
            if matrix[i][j] > 9 or matrix[i][j] < 0:
                print('Bad input - No solve available,', matrix[i][j], 'at', i, j, 'invalid digit.')
                return None

            if matrix[i][j] != 0:
                if not digit_is_allowed(matrix, matrix[i][j], (i, j)):
                    print('Bad input - No solve available,', matrix[i][j], 'at', i, j, 'failed validation.')
                    return None

    # Create hash of input and check if it already has a solution
    sudoku_hash = hashlib.md5(str(matrix).encode('utf-8')).digest()
    if sudoku_hash in stored_solves:
        print('Solved from hash')
        return stored_solves[sudoku_hash]

    # Attempt to solve the sudoku
    if not solve_sudoku(matrix):
        print('No solve available')
        return None

    # Store the hash and return the solution
    stored_solves[sudoku_hash] = matrix

    print('Solved from algorithm')
    return matrix


# Create a hashmap to load and store solutions
stored_solves = {}

# test_cases()

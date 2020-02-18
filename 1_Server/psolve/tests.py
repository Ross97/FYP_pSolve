# DESCRIPTION: Program to test the server (ensures APIs are responding).
import copy

import requests

import sudoku_solver


# TODO: Add more test-cases.
# TODO: Add cases for all puzzles and fuzz inputs.


def check_apis():
    """ Checks that each API is responding
        return 'PASS' if all responsive
        returns 'FAIL' if any unresponsive
    """

    try:
        api_list = ['sudoku/detect', 'sudoku/solve', 'differences/detect', 'tictactoe/detect', 'tictactoe/solve']
        for api in api_list:
            requests.get('http://0.0.0.0:5000/' + api)
        return 'PASS'
    except: # TODO: Add all exception cases
        return 'FAIL'


def check_solver_algortihm():
    """ Checks that the solver works as intended
        return 'PASS' if so
        returns 'FAIL' if not
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

    copied_valid_sudoku = copy.deepcopy(valid_sudoku)

    # Should return a valid solution
    valid = sudoku_solver.get_solution(valid_sudoku)
    if valid == -1:
        return 'FAIL'

    # Should return a valid hashed solution (same as before)
    valid_copy = sudoku_solver.get_solution(copied_valid_sudoku)
    if valid_copy == -1:
        return 'FAIL'

    # Should return -1
    invalid = sudoku_solver.get_solution(invalid_sudoku)
    if invalid != -1:
        return 'FAIL'

    return 'PASS'


def check_solver_api():
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

    response = requests.post('http://0.0.0.0:5000/sudoku/solve', json={'sudoku': valid_sudoku})
    if response.status_code == 500:
        return 'FAIL'
    else:
        return 'PASS'


if __name__ == '__main__':
    # Print test results
    print('\nTEST \t\t\tRESULT')
    print('==============================')

    # Check APIs are online
    print('APIs are all online\t', end='')
    print(check_apis())

    # Check Sudoku solver works
    print('Solver algorithm\t', end='')
    print(check_solver_algortihm())

    # Check Sudoku solver works via API
    print('Solver API works\t', end='')
    print(check_solver_api())

    # TODO: Add more tests

# DESCRIPTION: Program to find the next move in a TicTacToe.
import random


def show_matrix(matrix):
    """ Displays the matrix/tictactoe board """
    for i in range(3):
        for j in range(3):
            print(matrix[i][j], end=' ')
        print()
    print()


def game_over(matrix):
    """ Returns an option ('X' or 'O') if the game can be won
        Else returns None
    """
    for option in ['X', 'O']:
        game_won = option * 3

        # Row
        for k in range(3):
            if game_won == str(matrix[k][0]) + str(matrix[k][1]) + str(matrix[k][2]):
                return option

        # Col
        for k in range(3):
            if game_won == str(matrix[0][k]) + str(matrix[1][k]) + str(matrix[2][k]):
                return option
        # Diagonal
        if game_won == str(matrix[0][0]) + str(matrix[1][1]) + str(matrix[2][2]) \
                or game_won == str(matrix[0][2]) + str(matrix[1][1]) + str(matrix[2][0]):
            return option

    return None


def find_blank_cells(matrix):
    """ Returns a list of blank cells
        Else returns None
    """
    blank_cells = []
    for i in range(3):
        for j in range(3):
            if matrix[i][j] == 0:
                blank_cells.append([i, j])

    if blank_cells:
        return blank_cells

    return None


def can_win(matrix, blank_cells, option):
    """ Check if <option> can win
        Return cell co-ordinates if so
    """
    for cell in blank_cells:
        matrix[cell[0]][cell[1]] = option
        if game_over(matrix):
            matrix[cell[0]][cell[1]] = 0
            return cell
        else:
            matrix[cell[0]][cell[1]] = 0


def solve_tic_tac_toe(matrix, finish=True):
    """ Solves the tictactoe (assuming finish=True)
        If finish=False, gets the next move
        Returns the matrix and the winner (winner can be None)
    """
    show_matrix(matrix)

    game_winner = game_over(matrix)
    if game_winner:
        return matrix, game_winner

    blank_cells = find_blank_cells(matrix)
    if blank_cells is None:
        return matrix, None

    # Determine whose turn it is (default 'X')
    x_count = o_count = 0
    turn = 'X'
    opponent = 'O'
    for row in matrix:
        x_count += row.count('X')
        o_count += row.count('O')
    if x_count > o_count:
        turn = 'O'
        opponent = 'X'
    print('Turn:', turn)

    # Check if <turn> can win in 1 move, perform move if so
    winning_cell = can_win(matrix, blank_cells, turn)
    if winning_cell:
        print('Found winning move at', winning_cell)
        matrix[winning_cell[0]][winning_cell[1]] = turn
        show_matrix(matrix)
        if game_over(matrix):
            return matrix, game_over(matrix)

    # Check if <opponent> can win in 1 move, block if so
    opponent_winning_cell = can_win(matrix, blank_cells, opponent)
    if opponent_winning_cell:
        print('Blocking opponent', opponent, 'from winning at', opponent_winning_cell)
        matrix[opponent_winning_cell[0]][opponent_winning_cell[1]] = turn
    else:
        print('Randomly chose cell')
        rand = random.randint(0, len(blank_cells) - 1)
        matrix[blank_cells[rand][0]][blank_cells[rand][1]] = turn

    if finish:
        solve_tic_tac_toe(matrix)
    else:
        show_matrix(matrix)
        return matrix, None


def get_solution(matrix):
    """ Called from server
        Cleans matrix before calling solve_tic_tac_toe
        Return matrix, winner (winner can be none)
    """
    for i in range(3):
        for j in range(3):
            if matrix[i][j] != 'X' and matrix[i][j] != 'O':
                matrix[i][j] = 0

    return solve_tic_tac_toe(matrix, False)

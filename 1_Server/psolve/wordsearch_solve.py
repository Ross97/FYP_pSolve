# DESCRIPTION: Program to find words in a wordsearch. Outputs to file.
from random import randint

import cv2
import moviepy.editor as mpy

wordsearch_dir = 'static/images/wordsearches/'

# Font settings
fontScale = 0.7
thickness = 2


def word_position(wordsearch, row_col_length, word):
    """ Searches for the word in the wordsearch
        Returns the position and direction if found
    """
    for i in range(row_col_length):
        for j in range(row_col_length):
            letter = wordsearch[i][j]

            # Check Right
            if word[0] == letter and j + len(word) - 1 < row_col_length:
                found = True
                for k in range(len(word)):
                    if word[k] != wordsearch[i][j + k]:
                        found = False
                if found:
                    return [i, j, 'R']

            # Check Left
            if word[0] == letter and j - len(word) + 1 >= 0:
                found = True
                for k in range(len(word)):
                    if word[k] != wordsearch[i][j - k]:
                        found = False
                if found:
                    return [i, j, 'L']

            # Check Down
            if word[0] == letter and i + len(word) - 1 < row_col_length:
                found = True
                for k in range(len(word)):
                    if word[k] != wordsearch[i + k][j]:
                        found = False
                if found:
                    return [i, j, 'D']

            # Check Up
            if word[0] == letter and i - len(word) + 1 >= 0:
                found = True
                for k in range(len(word)):
                    if word[k] != wordsearch[i - k][j]:
                        found = False
                if found:
                    return [i, j, 'U']

            # TODO: Add check for diagonals


def solve_wordsearch(wordsearch, row_col_length, words, filename):
    """ Solve the wordsearch and writes to image 
        Creates a GIF of name {filename}.gif highlighting the found words
        Returns the filename
    """

    if not words:
        print('No words to search for')
        return -1

    words_found = []

    for word in words:
        if len(word) < 1:
            continue
        word = word.upper()
        position = word_position(wordsearch, row_col_length, word)
        if position:
            words_found.append([word, position])


    img = cv2.imread(wordsearch_dir + filename + '_unsolved.jpg')
    solved = img.copy()
    size = img.shape[0] // row_col_length
    small_padding = size // 2 - 5

    for word_found in words_found:
        padding = small_padding
        direction = word_found[1][2]
        rand_colour = randint(1, 200)

        if direction in ['R', 'L']:
            for letter in word_found[0]:
                cv2.putText(solved, letter,
                            (size * word_found[1][1] + padding, size * word_found[1][0] + size // 6 * 5),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (rand_colour, 0, 255), thickness + 1, 2)
                if direction == 'R':
                    padding += size
                else:
                    padding -= size

        elif direction in ['D', 'U']:
            for letter in word_found[0]:
                cv2.putText(solved, letter, (size * word_found[1][1] + small_padding,
                                             size * word_found[1][0] + size // 6 * 5 - small_padding + padding),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (255, 0, rand_colour), thickness + 1, 2)
                if direction == 'D':
                    padding += size
                else:
                    padding -= size

    # Create a GIF of the differences
    cv2.imwrite(wordsearch_dir + filename + '_solved.jpg', solved)
    frames = [wordsearch_dir + filename + '_unsolved.jpg', wordsearch_dir + filename + '_solved.jpg']
    image_sequence = mpy.ImageSequenceClip(frames, fps=2)
    image_sequence.write_gif(wordsearch_dir + filename + '_solved.gif', fps=2)

    return filename

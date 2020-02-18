# DESCRIPTION: Program to detect a sudoku and its digits from an image. Outputs to file.
import glob
import uuid

import cv2
import moviepy.editor as mpy

import image_processing

# Global settings
sudoku_dir = 'static/images/sudokus/'
fontScale = 1.35
thickness = 3

# Cache templates to increase performance (~100ms speed increase)
cached_sudoku_templates = {}
sudoku_template_dir = 'static/images/digit_templates/*'
templates = glob.glob(sudoku_template_dir)
for template_path in templates:
    template = cv2.imread(template_path, 0)
    template_name = template_path[len(sudoku_template_dir) - 1:-4]
    cached_sudoku_templates[template_name] = template


def get_sudoku_and_filename(img):
    """ Creates a GIF highlighting the digits found 
        Returns 
            a 9*9 array of the identified digits
            the filename
    """

    # Generate a unique filename
    filename = uuid.uuid4().hex[:3]

    fixed_perspective = image_processing.process_image(img)
    if fixed_perspective is None:
        return None, filename

    cv2.imwrite(sudoku_dir + filename + '_unsolved.jpg', fixed_perspective)
    fixed_perspective_gray = cv2.cvtColor(fixed_perspective, cv2.COLOR_BGR2GRAY)

    # Crop each box and pass its contents to get_value_from_image()
    # Add results to the matrix array
    matrix = []
    x = y = 0
    size = fixed_perspective.shape[0] // 9

    for i in range(1, 10):
        for j in range(1, 10):
            cell = fixed_perspective_gray[y + (size * (i - 1)): y + (size * i + 1),
                   x + (size * (j - 1)): x + (size * j + 1)]
            cropped = cell[cell.shape[0] // 5: cell.shape[1] - cell.shape[0] // 5,
                      cell.shape[0] // 5: cell.shape[0] - (cell.shape[0] // 5)]
            value = image_processing.get_value_from_image(cropped, cached_sudoku_templates, (38, 57), threshold=0.435)
            matrix.append(value)
            if value is not 0:
                cv2.putText(fixed_perspective, value, (x + size * j - size // 4 - 27, y + (size * i + 1) - 13),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (255, 100, 0), thickness, 2)

    # Output the detected_digits to file
    cv2.imwrite(sudoku_dir + filename + '_detected.jpg', fixed_perspective)

    # Create a GIF of the detected digits and the unsolved sudoku
    frames = [sudoku_dir + filename + '_unsolved.jpg', sudoku_dir + filename + '_detected.jpg']
    image_sequence = mpy.ImageSequenceClip(frames, fps=2)
    image_sequence.write_gif(sudoku_dir + filename + '.gif', fps=2)

    rows = []
    for i in range(0, 81, 9):
        rows.append(matrix[i:i + 9])

    return rows, filename


def write_solution_on_sudoku_img(filename, solution, unsolved_sudoku):
    """ Writes the digits of the supplied solution onto the supplied filename
        Skips detected digits
    """
    img = cv2.imread(sudoku_dir + filename + '_unsolved.jpg')
    size = img.shape[0] // 9
    x = y = size
    for i in range(9):
        for j in range(9):
            if str(solution[i][j]) != str(unsolved_sudoku[i][j]):
                cv2.putText(img, str(solution[i][j]), (x + size * j - size // 4 - 27, y + (size * i + 1) - 13),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (255, 100, 0), thickness, 2)
    cv2.imwrite(sudoku_dir + filename + '_sudoku_solved.jpg', img)

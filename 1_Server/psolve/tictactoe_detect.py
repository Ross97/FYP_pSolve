# DESCRIPTION: Program to detect a TicTacToe and its values from an image. Outputs to file.
import glob
import uuid

import cv2

import image_processing

# Cache images for faster comparison (less IO)
tictactoe_templates = 'static/images/tictactoe_templates/*'
templates = glob.glob(tictactoe_templates)
cached_tictactoe_templates = {}
for template_path in templates:
    template = cv2.imread(template_path, 0)
    template_value = template_path[len(tictactoe_templates) - 1: -4]
    cached_tictactoe_templates[template_value] = template

# Font settings
fontScale = 1.35
thickness = 3


def get_tictactoe_and_filename(img):
    """ Finds the tictactoes values and writes to image
        Returns 
            a 3*3 array of the identified values
            filename of the created image in static/images/tictactoes/ 
    """

    # Generate a unique filename
    filename = uuid.uuid4().hex[:3]

    fixed_perspective = image_processing.process_image(img)
    if fixed_perspective is None:
        return None, filename
    cv2.imwrite('static/images/tictactoes/' + filename + '_original.jpg', fixed_perspective)
    fixed_perspective_gray = cv2.cvtColor(fixed_perspective, cv2.COLOR_BGR2GRAY)

    # Crop each box and pass its contents to get_value_from_image()
    # Add results to the matrix array
    matrix = []
    x = y = 0
    size = fixed_perspective.shape[0] // 3

    for i in range(1, 4):
        for j in range(1, 4):
            cell = fixed_perspective_gray[y + (size * (i - 1)): y + (size * i + 1),
                   x + (size * (j - 1)): x + (size * j + 1)]
            cropped = cell[0: cell.shape[1] - size // 10,
                      int(cell.shape[0] / 10): int(cell.shape[0] - (cell.shape[0] / 10))]
            value = image_processing.get_value_from_image(img=cropped, templates=cached_tictactoe_templates,
                                                          template_size=(38, 57), threshold=0.25)
            matrix.append(value)

            if value is not 0:
                cv2.putText(fixed_perspective, str(value), (x + (size * j + 1) - int(size / 3), y + (size * i + 1)),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (255, 100, 0), thickness, 2)

    cv2.imwrite('static/images/tictactoes/' + filename + '_detected.jpg', fixed_perspective)

    rows = []
    for i in range(0, 9, 3):
        rows.append(matrix[i:i + 3])

    return rows, filename


def write_solution_on_tictactoe_img(filename, solution, unsolved_tictactoe):
    """ Writes the values of the solution onto the filename
        Writes detected values from unsolved_tictactoe in one colour/size
        Writes new value (difference of solution-unsolved_tictactoe) in another colour/size
    """
    
    img = cv2.imread('static/images/tictactoes/' + filename + '_original.jpg')
    size = img.shape[0] // 3
    x = y = size
    for i in range(3):
        for j in range(3):
            if solution[i][j] is 0:
                continue
            if str(solution[i][j]) == str(unsolved_tictactoe[i][j]):
                cv2.putText(img, str(solution[i][j]),
                            (x + size * j - (size // 3 * 2), y + (size * i + 1) - (size // 3)),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale * 2, (255, 0, 0), thickness + 1, 2)
            else:
                cv2.putText(img, str(solution[i][j]),
                            (x + size * j - (size // 3 * 2), y + (size * i + 1) - (size // 3)),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale * 2.5, (0, 255, 0), thickness + 1, 2)

    cv2.imwrite('static/images/tictactoes/' + filename + '_next_move.jpg', img)

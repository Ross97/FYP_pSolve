# DESCRIPTION: Program to detect a wordsearch and its values from an image. Outputs to file.
import glob
import uuid

import cv2
import moviepy.editor as mpy

import image_processing

wordsearch_dir = 'static/images/wordsearches/'

# Cache images for faster comparisons (less IO)
letter_templates = 'static/images/letter_templates/*'
templates = glob.glob(letter_templates)
cached_letters_templates = {}
for template_path in templates:
    template = cv2.imread(template_path, 0)
    template_value = template_path[len(letter_templates) - 1: -4]
    cached_letters_templates[template_value] = template

# Font settings
fontScale = 0.7
thickness = 2


def get_wordsearch_and_filename(img, row_col_len):
    """ Returns 
            a row_col_len*row_col_len array of the identified values
            the filename of the created images
        Processes inputted image
        Finds values 
        Creates a GIF of the original image and the detected values image
        Calls get_value_from_image() for each cell in image
    """

    # Generate a unique filename
    filename = uuid.uuid4().hex[:3]

    fixed_perspective = image_processing.process_image(img)
    if fixed_perspective is None:
        return None, filename
    cv2.imwrite(wordsearch_dir + filename + '_unsolved.jpg', fixed_perspective)
    fixed_perspective_gray = cv2.cvtColor(fixed_perspective, cv2.COLOR_BGR2GRAY)

    # Crop each box and pass its contents to get_value_from_image()
    # Add results to the matrix array
    matrix = []
    x = y = 0
    size = fixed_perspective.shape[0] // row_col_len

    for i in range(1, row_col_len + 1):
        for j in range(1, row_col_len + 1):
            cell = fixed_perspective_gray[y + (size * (i - 1)): y + (size * i + 1),
                   x + (size * (j - 1)): x + (size * j + 1)]
            cropped = cell[0: cell.shape[1] - size // 10,
                      int(cell.shape[0] / 10): int(cell.shape[0] - (cell.shape[0] / 10))]
            value = image_processing.get_value_from_image(img=cropped, templates=cached_letters_templates,
                                                          template_size=(18, 22), threshold=0.39)
            matrix.append(value)

            if value is not 0:
                cv2.putText(fixed_perspective, str(value),
                            (x + (size * j + 1) - int(size / 1.5), y + (size * i + 1) - int(size / 3.5)),
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale, (255, 100, 0), thickness, 2)

    # Output the detected_digits to file
    cv2.imwrite(wordsearch_dir + filename + '_detected.jpg', fixed_perspective)

    # Create a GIF of the detected digits and the unsolved sudoku
    frames = [wordsearch_dir + filename + '_unsolved.jpg', wordsearch_dir + filename + '_detected.jpg']
    image_sequence = mpy.ImageSequenceClip(frames, fps=2)
    image_sequence.write_gif(wordsearch_dir + filename + '.gif', fps=2)

    rows = []
    for i in range(0, row_col_len * row_col_len, row_col_len):
        rows.append(matrix[i:i + row_col_len])

    return rows, filename

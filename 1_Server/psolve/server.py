# DESCRIPTION: Flask server to handle and respond to HTTP requests.
import copy

import imutils
from flask import Flask, request, jsonify, make_response, render_template

import differences
import image_processing
import sudoku_detect
import sudoku_solve
import tictactoe_detect
import tictactoe_solve
import wordsearch_detect
import wordsearch_solve

# Flask server configuration
psolve = Flask(__name__, static_url_path='/static')
psolve.config['DEBUG'] = True


@psolve.route('/', methods=['GET'])
@psolve.route('/index', methods=['GET'])
def index():
    return render_template('api_documentation.html')


@psolve.route('/sudoku/detect', methods=['POST'])
def sudoku_detection():
    """
        /sudoku/detect API accepts POST requests
        Request must contain a base-64 encoded image as 'b64_data'
        On success returns
            'result': 'success'
            'digits': a 9*9 list of detected digits
            'filename': the filename used in static/images/sudokus/
        On fail returns 'result': fail'
    """

    print('\n/sudoku/detect received HTTP POST request')

    # Check for required data
    if not request.json or 'b64_data' not in request.json:
        print('Cannot find b64 data to decode in the POST request')
        return make_response(jsonify({'result': 'fail'}), 400)

    b64_data = request.json['b64_data']

    # Decode the b64 encoded image
    img = image_processing.convert_b64_to_cv2(b64_data)

    # Rotate image 90 degrees (required for iOS b64 encoded images from camera)
    if 'rotated' in request.json:
        if request.json['rotated']:
            img = imutils.rotate_bound(img, 90)

    # Find the sudoku digits and obtain a filename 
    sudoku, filename = sudoku_detect.get_sudoku_and_filename(img)

    if not sudoku:
        return make_response(jsonify({'result': 'fail'}), 400)

    # Return the digits found
    return make_response(jsonify({'result': 'success', 'digits': sudoku, 'filename': filename}), 200)


@psolve.route('/sudoku/solve', methods=['POST'])
def sudoku_solver():
    """
        /sudoku/solve API accepts POST requests
        Request must contain 'sudoku', a sudoku matrix to be solved (9*9 array)
        Request may contain 'filename', the current filename (from previous detection)
        On success returns
            'result': 'success'
            'digits': a 9*9 list of the solved sudoku
        If 'filename' is supplied and valid, a new image will be created at static/images/sudokus/{filename}.jpg
        On fail returns 'result': 'fail'
    """

    print('\n/sudoku/solve received HTTP POST request')

    if not request.json or 'sudoku' not in request.json:
        print('Cannot find sudoku data in the POST request')
        return make_response(jsonify({'result': 'fail', 'reason': 'no \'sudoku\' key found'}), 400)

    # Extract data from request
    unsolved_sudoku = request.json['sudoku']
    filename = None
    if 'filename' in request.json:
        filename = request.json['filename']
    
    # Solve the sudoku (pass a copy to not mutate the unsolved_sudoku list)
    solution = sudoku_solve.get_solution(copy.deepcopy(unsolved_sudoku))

    # Return 'fail' if solve not found
    if not solution:
        return make_response(jsonify({'result': 'fail'}), 400)

    # If a filename is passed, write solution onto the original image and save it
    if filename:
        sudoku_detect.write_solution_on_sudoku_img(filename, solution, unsolved_sudoku)

    # Return the solved sudoku
    return make_response(jsonify({'result': 'success', 'solution': solution}), 200)


@psolve.route('/differences/detect', methods=['POST'])
def differences_detection():
    """
        /differences/detect API accepts POST requests
        Request must contain two base-64 encoded images (image_one and image_two)
        On success returns
            'result': 'success'
            'filename': the file name of the image found at static/images/differences/{filename}.jpg
        On fail returns 'result': 'fail'
    """

    print('\n/differences/detect received HTTP POST request')

    # Check for required data
    if not request.json or 'image_one' not in request.json or 'image_two' not in request.json:
        print('Cannot find both images to decode in the POST request')
        return make_response(jsonify({'result': 'fail'}), 400)

    image_one = request.json['image_one']
    image_two = request.json['image_two']

    # Rotate image 90 degrees (required for iOS b64 encoded images from camera)
    is_camera_image = False
    if 'is_camera_image' in request.json:
        is_camera_image = request.json['is_camera_image']

    # Decode the b64 encoded images
    img_one = image_processing.convert_b64_to_cv2(image_one)
    img_two = image_processing.convert_b64_to_cv2(image_two)

    # Get the filename where the differences have been saved
    filename = differences.compare(img_one, img_two, is_camera_image)

    # If there is an issue, for example the images are not the same size
    if not filename:
        return make_response(jsonify({'result': 'fail'}), 400)

    return make_response(jsonify({'result': 'success', 'filename': filename}), 200)     


@psolve.route('/tictactoe/detect', methods=['POST'])
def tictactoe_detection():
    """
        /sudoku/detect API accepts POST requests
        Request must contain a b64 encoded image as 'b64_data'
        On success returns
            'result': 'success'
            'digits': a 9*9 list of detected digits
            'filename': the filename used in static/images/sudokus/
        On fail returns 'result': fail'
    """

    print('\n/tictactoe/detect received HTTP POST request')

    # Check for required data
    if not request.json or 'b64_data' not in request.json:
        print('Cannot find b64 data to decode in the POST request')
        return make_response(jsonify({'result': 'fail'}), 400)

    b64_data = request.json['b64_data']

    # Decode the b64 encoded image
    img = image_processing.convert_b64_to_cv2(b64_data)

    # Rotate image 90 degrees (required for iOS b64 encoded images from camera)
    if request.form.get('rotated'):
        img = imutils.rotate_bound(img, 90)

    # Find the sudoku digits and obtain a filename 
    tictactoe, filename = tictactoe_detect.get_tictactoe_and_filename(img)

    if tictactoe is None:
        return make_response(jsonify({'result': 'fail'}), 400)

    # Return the digits found
    return make_response(jsonify({'result': 'success', 'digits': tictactoe, 'filename': filename}), 200)


@psolve.route('/tictactoe/solve', methods=['POST'])
def tictactoe_solver():
    """
        /sudoku/solve API accepts POST requests
        Request must contain 'sudoku', a sudoku matrix to be solved (9*9 array)
        Request may contain 'filename', the current filename (from detection)
        On success returns
            'result': 'success'
            'digits': a 9*9 list of the solved sudoku
        If 'filename' is supplied and valid, a new image will be created at static/images/sudokus/
        On fail returns 'result': 'fail'
    """

    print('\n/tictactoe/solve received HTTP POST request')

    if not request.json or 'tictactoe' not in request.json:
        print('Cannot find tictactoe data in the POST request')
        return make_response(jsonify({'result': 'fail', 'reason': 'no \'tictactoe\' key found'}), 400)

    # Extract data from request
    unsolved_tictactoe = request.json['tictactoe']
    filename = None
    if 'filename' in request.json:
        filename = request.json['filename']

    # Solve the tictactoe (pass a copy to not mutate the unsolved_tictactoe list)
    solution, winner = tictactoe_solve.get_solution(copy.deepcopy(unsolved_tictactoe))

    # If a filename is passed, write solution onto the original image and save it
    if filename:
        tictactoe_detect.write_solution_on_tictactoe_img(filename, solution, unsolved_tictactoe)

    # Return the solved tictactoe
    return make_response(jsonify({'result': 'success', 'solution': solution, 'winner': winner}), 200)


@psolve.route('/wordsearch/detect', methods=['POST'])
def wordsearch_detection():
    """
        /sudoku/detect API accepts POST requests
        Request must contain a b64 encoded image as 'b64_data'
        On success returns
            'result': 'success'
            'digits': a 9*9 list of detected digits
            'filename': the filename used in static/images/sudokus/
        On fail returns 'result': fail'
    """

    print('\n/wordsearch/detect received HTTP POST request')

    # Check for required data
    if not request.json or 'b64_data' not in request.json or 'size' not in request.json:
        print('Cannot find b64 data to decode in the POST request')
        return make_response(jsonify({'result': 'fail'}), 400)

    b64_data = request.json['b64_data']
    size = int(request.json['size'])

    # Decode the b64 encoded image
    img = image_processing.convert_b64_to_cv2(b64_data)

    # Rotate image 90 degrees (required for iOS b64 encoded images from camera)
    if 'rotated' in request.json:
        if request.json['rotated']:
            img = imutils.rotate_bound(img, 90)

    # Find the wordsearch digits and obtain a filename 
    wordsearch, filename = wordsearch_detect.get_wordsearch_and_filename(img, size)

    if wordsearch is None:
        return make_response(jsonify({'result': 'fail'}), 400)

    # Return the digits found
    return make_response(jsonify({'result': 'success', 'digits': wordsearch, 'filename': filename}), 200)


@psolve.route('/wordsearch/solve', methods=['POST'])
def wordsearch_solver():
    """
        /sudoku/solve API accepts POST requests
        Request must contain 'sudoku', a sudoku matrix to be solved (9*9 array)
        Request may contain 'filename', the current filename (from detection)
        On success returns
            'result': 'success'
            'digits': a 9*9 list of the solved sudoku
        If 'filename' is supplied and valid, a new image will be created at static/images/sudokus/
        On fail returns 'result': 'fail'
    """

    print('\n/wordsearch/solve received HTTP POST request')

    if not request.json or 'wordsearch' not in request.json or 'size' not in request.json or 'words' not in request.json or 'filename' not in request.json:
       make_response(jsonify({'result': 'fail', 'reason': 'Missing required parameters'}), 400)

    # Extract data from request
    unsolved_wordsearch = request.json['wordsearch']
    size = request.json['size']
    word_list = request.json['words']
    filename = request.json['filename']
    
    # Solve the tictactoe (pass a copy to not mutate the unsolved_tictactoe list)
    filename = wordsearch_solve.solve_wordsearch(unsolved_wordsearch, size, word_list, filename)

    # Return the solved tictactoe
    return make_response(jsonify({'result': 'success', 'filename': filename}), 200)


# Run server
psolve.run(host='0.0.0.0')

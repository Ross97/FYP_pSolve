# DESCRIPTION: Common image processing functions (imported by other files)
import base64
import os

import cv2
import numpy as np

# Create puzzle image-folders if required
required_dirs = ['sudokus', 'differences', 'tictactoes', 'wordsearches']
for directory in required_dirs:
    if not os.path.isdir('static/images/' + directory):
        os.mkdir(directory)


def convert_b64_to_cv2(b64_encoded_img):
    """ Returns a CV2 representation of a B64 encoded image """
    b64_data = str.encode(b64_encoded_img)
    image_decoded = base64.decodebytes(b64_data)
    numpy_array = np.frombuffer(image_decoded, np.uint8)
    return cv2.imdecode(numpy_array, cv2.IMREAD_UNCHANGED)


def get_largest_contour(threshhold_image):
    """ Returns the largest contour found in a thresholded image """
    contours, _ = cv2.findContours(threshhold_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour, largest_area = None, 0
    for cont in contours:
        cont_area = cv2.contourArea(cont)
        if cont_area > largest_area:
            largest_area = cont_area
            largest_contour = cont
    return largest_contour


def get_corners_from_contour(contour):
    """ Returns corner coordinates detected from a contour """
    accuracy = .03 * cv2.arcLength(contour, True)  # .03 suitable (lower means less detail)
    approx = cv2.approxPolyDP(contour, accuracy, True)
    return cv2.convexHull(approx)


def fix_perspective_using_corners(img, img_size, corner_coords):
    """ Returns the fixed perspective version of the CV2 image
        Input is the image, the image's size, and the corner coordinates
    """

    # Find the bottom right point of the corners (largest sum of x and y is always the bottom right)
    largest_sum = 0
    for coord in corner_coords:
        for x, y in coord:
            if (x + y) > largest_sum:
                largest_sum = x + y
                bottom_right = [x, y]

    # Check if the bottom right matches the first co-ord in the list
    # Else orientate the points as required
    if bottom_right[0] == corner_coords[0][0][0] and bottom_right[1] == corner_coords[0][0][1]:
        top_left = corner_coords[2][0]
        bottom_left = corner_coords[1][0]
        bottom_right = corner_coords[3][0]
        top_right = corner_coords[0][0]
    else:
        bottom_left = corner_coords[2][0]
        top_right = corner_coords[1][0]
        top_left = corner_coords[3][0]
        bottom_right = corner_coords[0][0]

    # Transform the image and return the result
    source = np.array([top_left, bottom_right, top_right, bottom_left], dtype='float32')
    destination = np.array([[0, 0], [img_size - 1, 0], [img_size - 1, img_size - 1], [0, img_size - 1]],
                           dtype='float32')
    perspective_transform = cv2.getPerspectiveTransform(source, destination)
    return cv2.warpPerspective(img, perspective_transform, (img_size, img_size))


def process_image(img):
    """ Processes an image
        Grays, thresholds, detects bounding box, detects corners, fixes perspective
        Returns processed image
    """

    # Resize image to reduce filesize and bandwith, pre-process the image
    img = cv2.resize(img, (500, 500), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 1, 11, 2)

    # Find biggest contour (edge of sudoku)
    # Check it is sufficiently sized
    largest_contour = get_largest_contour(thresh)
    x, y, w, h = cv2.boundingRect(largest_contour)
    if w < 100 or h < 100:
        print('Cannot find big enough bounding box')
        return None

    # Find the corner co-ords from largest_contour
    corner_coords = get_corners_from_contour(largest_contour)
    if len(corner_coords) != 4:
        print('Cannot find 4 corners. Found', len(corner_coords))
        return None

    # Detect image size
    img_size = 0
    for coords in largest_contour:
        img_size = max(img_size, coords[0][1])

    # Fix perspective using corner_coords and img_size
    fixed_perspective = fix_perspective_using_corners(img, img_size, corner_coords)
    return fixed_perspective


def get_value_from_image(img, templates, template_size, threshold):
    """ Returns the value found or 0 if no value found
        Input is the image, dict of image templates, template size (tuple), and threshold
    """

    # Pre-process the image and find contours
    thresh = cv2.adaptiveThreshold(img, 255, 1, 1, 11, 2)
    largest_contour = get_largest_contour(thresh)
    if largest_contour is None:
        return 0

    # Crop to the contour (value) detected in the image
    x, y, w, h = cv2.boundingRect(largest_contour)
    crop_img = img[y: y + h, x: x + w]

    # Resize the value to match template size
    resized_image = cv2.resize(crop_img, template_size, interpolation=cv2.INTER_AREA)

    # Iterate over each template, perform template matching
    # Store likelihood of each template
    template_likelihood = {}
    for template in templates:
        res = cv2.matchTemplate(resized_image, templates[template], cv2.TM_CCOEFF_NORMED)
        results = np.where(res >= threshold)
        if len(results[0]) > 0:
            template_likelihood[template] = res[results][0]
            if template in ['2', '3', '5']:  # Boost weaker templates's likelihood
                template_likelihood[template] += 0.085

    if template_likelihood:
        return max(template_likelihood, key=template_likelihood.get)

    return 0

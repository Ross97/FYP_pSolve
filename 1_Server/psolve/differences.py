# DESCRIPTION: Program to find the differences between two images and write them to file.
import uuid

import cv2
import imutils
from skimage.metrics import structural_similarity


def compare(image_a, image_b, is_camera_image):
    """ Compare input images and write the results to file
        If is_camera_image, rotatte and blur accordingly
        Returns filename of the image, or None if it fails
    """

    # Generate a unique filename
    filename = uuid.uuid4().hex[:3]

    if is_camera_image:
        image_a = imutils.rotate_bound(image_a, 90)
        image_b = imutils.rotate_bound(image_b, 90)

    # Store original to show in future
    original = image_a

    # Convert to greyscale
    image_a = cv2.cvtColor(image_a, cv2.COLOR_BGR2GRAY)
    image_b = cv2.cvtColor(image_b, cv2.COLOR_BGR2GRAY)

    # Reduce size and blur to account for shaky handheld camera based images
    if is_camera_image:
        scale_multiplier = 0.03125
        image_a = cv2.resize(image_a, (0, 0), fx=scale_multiplier, fy=scale_multiplier)
        image_b = cv2.resize(image_b, (0, 0), fx=scale_multiplier, fy=scale_multiplier)
        image_a = cv2.GaussianBlur(image_a, (1001, 1001), cv2.BORDER_DEFAULT)
        image_b = cv2.GaussianBlur(image_b, (1001, 1001), cv2.BORDER_DEFAULT)

    # Obtain SSIM and determine differences
    try:
        _, differences = structural_similarity(image_a, image_b, full=True, gaussian_weights=True)
    except ValueError:
        print('Images are not the same size')
        return None

    # Convert to cv2 array
    differences = (differences * 255).astype('uint8')

    # Threshold and find contours (differences)
    thresh = cv2.threshold(differences, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    contours = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(contours)

    # Draw contours (differences)
    for cont in contours:
        (x, y, w, h) = cv2.boundingRect(cont)
        if is_camera_image:
            multiplier = int(1 / scale_multiplier)
            y *= multiplier
            x *= multiplier
            h *= multiplier
            w *= multiplier
        cv2.rectangle(original, (x, y), (x + w, y + h), (255, 0, 0), 4)

    # TODO: Create GIF highlighting differences (instead of statuic image)
    cv2.imwrite('static/images/differences/' + filename + '.jpg', original)

    return filename

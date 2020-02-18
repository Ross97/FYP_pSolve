#!/bin/bash
# This script is run as a regular cron job
# The script simply deletes folders containing images to free up space

echo "Deleting folders: /sudokus/ /differences/ /tictactoes/ /wordsearches/ ..."

find /home/ross/psolve/static/images/sudokus/ | xargs rm -rf
mkdir /home/ross/psolve/static/images/sudokus

find /home/ross/psolve/static/images/differences/ | xargs rm -rf
mkdir /home/ross/psolve/static/images/differences/

find /home/ross/psolve/static/images/tictactoes/ | xargs rm -rf
mkdir /home/ross/psolve/static/images/tictactoes/

find /home/ross/psolve/static/images/wordsearches/ | xargs rm -rf
mkdir /home/ross/psolve/static/images/wordsearches/

echo "Deletion complete"
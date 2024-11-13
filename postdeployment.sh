npm18 install
# Disable exit-on-error
set +e
# Run the fuser command to kill the process using TCP port 3000
sudo fuser -n tcp -k 5000
# Capture the exit status of the fuser command
FUSER_EXIT_CODE=$?
# Re-enable exit-on-error
set -e
# Check if the fuser command was successful
if [ $FUSER_EXIT_CODE -eq 0 ]; then
 echo "fuser command was successful. Running the next command..."
 # Replace this line with your actual command
   echo "Process on port 5000 killed"
     else
 echo "fuser command failed. Continuing the job..."
 fi

#kill $( lsof -i:5000 -t )
npm18 start > /dev/null 2>&1 &

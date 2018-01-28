#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "This will automatically update your discord-config.json"
echo -e "to populate the server list with all servers your bot"
echo -e "has access to."
echo -e ""
echo -e "Your token must be present in discord-config.json"
echo -e ""
echo -e "If you have any existing servers in the configuration,"
echo -e "they will not be overwritten."
echo -e ""
echo -e "Type 'accept' to continue with the file update."
echo -e ""
read -p "> " answer
echo -e ""

if [[ $answer = accept ]] ; then
	node $DIR/script/update-config.js
else
	echo -e "You did not type 'accept', cancelling ..."
	sleep 3
fi

exit

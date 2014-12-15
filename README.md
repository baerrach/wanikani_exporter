WaniKani Exporter
=================

This small [node.js](http://nodejs.org/) command line script will
create a JSON export of the WaniKani resources radicals, kanji, or
vocabulary and write them into a file in the current directory.

You can then use the exported data in your other JavaScript programs
as a cross-reference point.

What you need to do
===================

Install node.js
---------------

You will need to install [node.js](http://nodejs.org/) and then
install the dependencies async, request, and underscore.

    npm install async
    npm install request
    npm install underscore

Create the user_api_key.txt file
--------------------------------

You can get the value of your USER_API_KEY from
https://www.wanikani.com/api or from your WaniKani profile page.

Create the user_api_key.txt file and paste in your API key.

Run wanikani_export.js
----------------------

You can run any of the following commands:
    node wanikani_export.js radicals
    node wanikani_export.js kanji
    node wanikani_export.js vocabulary

The command may take a few seconds to run and does not provide any
feedback, at the completion of the command the resource will be
written into a *.json file. This git repository contains an export
from Dec 2014.


         
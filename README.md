# Project Task Manager

Based on monday.com but simpler. 

### `Starting the app`

Make sure to npm install first the dependencies for ***server** and ***client** folder.\
In the server folder, goto ***config.js*** and fill up the environment variables that was mentioned there in the .env file that you created.\

### `Production/Development`

Production config is already set up by default. If you want to run it in development mode goto\
***client/src/constants/config.js***. This contains all the important configs in order to run the app\
properly and communicate with the backend.

### `Config`

I used ***oauth client*** and ***google service account*** for google login and google drive v3 respectively.\
So you need to create your own credentials in google developer console for ***oauth client for the config.js in the client***.\
And ***google service account for the config.js in the server***. You only need to download the ***.json file*** that the service account \
provided when you created it and put it inside the server folder root directory.

Happy coding!

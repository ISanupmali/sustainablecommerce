# Headless Commerce Front-End (Built using React Js)

# Pre-requisites!
These are the essentials to run the below React Js Front End app locally.

| SDK's / Libraries / Packages | Download link / Documentation Link |
| ------ | ------ |
| Node and Npm  | [https://nodejs.org/en/] - Check if node is installed using  ```node -v``` in command prompt. If not, install it using the link provided here. |
| Axios for React | [https://www.npmjs.com/package/react-axios?activeTab=readme] - This does not need to be installed explicitly. This will get installed automatically when you run npm install which will basically install all the project dependencies. However, do not run it right now. Steps for installing dependencies are listed below. |

### Installation Steps

Follow the installation Steps to run the React application on your local machine:

* [Directory] - Navigate to the `fe-workspace` directory
* [Node Package] - To install all the node packages, run ```npm install``` in the root folder of your workspace (fe-workspace). Run it where the package.json file is located. NPM will then install all the dependent packages for your project. The packages that will be installed are **axios, js-cookie & react-helmet**
* **Do not run** npm audit fix even if the NPM package manager insists for it. It will upgrade all the dependencies and may cause issues
* Your front end will interact with the BE layer via Axios requests. So it is essential to start the backend server before you start running the front end app. Please refer to the readme in `be-workspace` folder for the instructions to start the backend server
* [Running the application] - In the root folder, go to command prompt or the VS studio terminal and  ```npm start```.  This will start your backend node server on http://localhost:3000

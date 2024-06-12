# Headless Commerce (Salesforce Commmerce API's + Node Js)

# Pre-requisites!

These are the essentials to run the below node application locally.

| SDK's / Libraries / Packages | Download link / Documentation Link |
| ------ | ------ |
| Node and Npm  | [https://nodejs.org/en/] - Check if node is installed using  ```node -v``` in command prompt. If not, install it using the link provided here. Node.js version 10 and 12 LTS are supported with Salesforce Commerce SDK as per the official documentation. However, code shall work fine with Node.js version 18 and above as well. |
| Nodemon | [https://www.npmjs.com/package/nodemon] - Useful tool that autorestarts the application when file changes are detecte in the node project. Install using ```npm install nodemon``` |
| Express Js | [https://expressjs.com/] - This does not need to be installed explicitly. This will get installed automatically when you run npm install which will basically install all the project dependencies. However, do not run it right now. Steps for installing dependencies are listed below. |
| Salesforce Commerce SDK | [https://www.npmjs.com/package/commerce-sdk] - This does not need to be installed explicitly. Allows easy interaction with the Salesforce B2C Commerce platform APIs on the Node.js runtime. |

# Sandbox Configuration
To be able to use the Commerce SDK, the following parameters are needed which can be retrieved from SFCC Account Manager for a particular sandbox. Reach out to the support team to get these details.


### Installation Steps

Follow the installation Steps to run the node application on your local machine:

* [Directory] - Navigate to the be-workspace directory
* [Node Package] - To install all the node packages, run ```npm install``` in the root folder of your workspace (be-workspace). Run it where the package.json file is located. NPM will then install all the dependent packages for your project. The packages that will be installed are **express, cors & commerce-sdk**
* **Do not run** npm audit fix even if the NPM package manager insists for it. It will upgrade all the dependencies and may cause issues
* To connect commerce-sdk to your sandbox, modify the `config.js` file under the routes/config directory. This config file contains your clientId, organizationId, shortCode & siteId
* [Running the application] - In the root folder, go to command prompt or the VS studio terminal and run ```nodemon index.js``` or ```npm start``` if you do not have nodemon installed. This will start your backend node server on `http://localhost:8080`

### References

| Tech | Reference Link |
| ------ | ------ |
| Node JS | https://nodejs.org/en/ |
| Commerce SDK | https://www.npmjs.com/package/commerce-sdk |
| Express JS | https://expressjs.com/ |
| Commerce SDK Modules | https://salesforcecommercecloud.github.io/commerce-sdk/globals.html - This is where you will find all the documentaiton related to the Commerce SDK. Sample examples are given which can help you in constructing an API Client and then retrieving data from the Salesforce Commerce API. |

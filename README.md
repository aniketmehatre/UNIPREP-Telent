# Uniprep Application

## Prerequisites
Ensure you have the following installed before starting:
- [Node.js](https://nodejs.org/) (Recommended LTS version)
- [Angular CLI](https://angular.io/cli)
  ```sh
  npm install -g @angular/cli
  ```

## Installation
Clone the repository and install dependencies:
```sh
git clone <repository-url>
cd <project-folder>
npm install
```

## Development Server
To run the application in development mode:
```sh
ng serve
```
Then, open [http://localhost:4200](http://localhost:4200) in your browser.

## Build
To build the application for production:
```sh
ng build --prod
```
The build files will be located in the `dist/` folder.

## Running Tests
Run unit tests:
```sh
ng test
```

Run end-to-end tests:
```sh
ng e2e
```

## Linting
Check and fix linting issues:
```sh
ng lint
```

## Deployment
To deploy the application, build it first and serve the contents of the `dist/` folder using a web server.
```sh
ng build --prod
npx http-server dist/<project-folder>
```

## Additional Commands
Update Angular CLI and dependencies:
```sh
ng update
```

Generate a new component:
```sh
ng generate component component-name
```

## License
This project is licensed under the MIT License.


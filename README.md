<p align="center">
  <img src="https://github.com/kirwa-KO/discord-clone/blob/main/discord-clone.svg" />
</p>

<p align="center">
Discord using Reactjs, Mongodb and Nestjs
</p>

## Technologies
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB&link=https://github.com/arihant-jain-09)](https://github.com/kirwa-KO)
[![Nestjs](https://img.shields.io/badge/Nest-20232A?style=flat&logo=nestjs&logoColor=ED2945)](https://github.com/kirwa-KO)
[![Socket.io](https://img.shields.io/badge/Socket.io-20232A?style=flat&logo=socket.io&logoColor=FFF)](https://github.com/kirwa-KO)
[![Mongodb](https://img.shields.io/badge/Mongodb-20232A?style=flat&logo=mongodb&logoColor=00684A)](https://github.com/kirwa-KO)
[![Mongodb](https://img.shields.io/badge/Swagger-20232A?style=flat&logo=swagger&logoColor=85E92C)](https://github.com/kirwa-KO)





## About
**Discord** with **Features** like realtime chat app, **Private chat**, **Rooms chat**
- React is used along with [react-toastify](https://www.npmjs.com/package/react-toastify) to **user friendly** front-end.
- React Routing with Error handling and Discord Loading between pages.
- **Realtime notification** for rooms and also for private direct messages
- **Nestjs** with **json web token** web token for **authentication** and **authorization**
- **Nestjs** with **Rest Api** to see all **users**, **rooms** and **messages**
- **Swagger** api documentation in http://localhost:5000/api#/ after run the Backend

## Run and build

#### Clone the project

```bash
git clone https://github.com/kirwa-KO/discord-clone.git
```

#### Install Backend and Frontend dependencies
```bash
cd Backend && npm i
cd Frontend && npm i
```
#### Note: Before Startup project change mongodb databse link
```bash
# change the app variables with your
cd Backend && cp .env.sample .env
# and put in  MONGODB_URI variable in .env with your mongodb database link
```

#### Startup project

```bash
cd Backend && npm run start:dev
cd Frontend && npm start
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### Build the project and get the optimized version

```bash
cd Backend && npm build
cd Frontend && npm build
```

## License
discord-clone is licensed under MIT license. View license. [LICENSE](https://github.com/kirwa-KO/discord-clone/blob/main/LICENSE)

## Support
#### This app costs me time to make and maintain every time.
[I am very 😀 about every coffee!]

<a href="https://www.buymeacoffee.com/imranbaali" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>

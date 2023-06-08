# PARKing Lot

PARKing Lot is an app designed to display information related to all parks operated by the National Parks Service.

To view the app online, visit 

---

## TECHNOLOGIES USED

* Node.js
* Express
* EJS
* JavaScript
* CSS
* Postgres
* Sequelize

---

## HOW TO INSTALL

Requires `Node.js`, `Postgres`, and `Sequelize`

1. Get a free api key from the [National Parks](https://www.nps.gov/subjects/developer/get-started.htm) website.
2. Creat a free [Mapbox](https://account.mapbox.com/auth/signup/) account and take note of the API access token. (Default public token OK)
    * Please note that while you will be required to enter a valid credit card number, your account will not be charged until the api calls pass a limit. For more information, visit https://www.mapbox.com/pricing
3. Fork and clone this repository to your local machine.
4. Create a .env file and add the following:
```env
SECRET_SESSION = [insert any string here]
NP_API_KEY = [insert national parks api key here]
MAP_API_KEY = [insert mapbox api key here]
```
5. Run `sequelize db:create`, `sequelize db:migrate:all`, and `sequelize db:seed:all` to setup database.
6. Run `npm run dev` to start server.
7. Open `http://localhost:3000` in a web browser to access app.

---

## HOW TO INSTALL  

Clone this repository to your machine.

```bash
git clone https://github.com/jondavila/mountain-climber.git
```

Open index.html file in a browser to play.

Open app.js file in a text editor to view/edit the code that makes this work.

---

## GAMEPLAY

![screenshot](/images/gamescreenshot.png)

---

## HOW IT WORKS
The game's main mechanic is moving the square side to side and bouncing off of platforms.

### COLLISION DETECTION (BOUNCING)
```javascript
function positionUpdate() {
    user.dy += gravity;
    user.y += user.dy;
    // user.x += user.dx;
    user.render();
}

function detectHit(user, platform) {
    // we only want to detect hits from above, as we want the users to pass through plaforms from below

    let hitTest = (
        user.y + user.height > platform.y &&
        user.y < platform.y + platform.height &&
        user.x + user.width > platform.x &&
        user.x < platform.x + platform.width &&
        user.dy > 1
    );

    if (hitTest) {
        user.dy = -12
    }
}
```

In the real world, an object's vertical velocity is applied a constant acceleration due to gravity. This game emulates that by adding a `gravity` constant to the user's speed each time the game loop is iterated - every 22 milliseconds. Once the user is falling down, any overlap between the user's and platforms' position will result in the user's vertical speed to change to a set value. `gravity` will affect this value immediately, resulting in a smoother vertical motion.

*It's important to note that the game's frame of reference considers down and right to be positive*


### PLAYER MOVEMENT
```javascript
function movementHandler(e) {
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
        user.dx = -5;
    } else if (e.key === 'ArrowRight' || e.code === 'KeyD') {
        user.dx = 5;
    }
}

function positionUpdate() {
    // user.dy += gravity;
    // user.y += user.dy;
    user.x += user.dx;
    // user.render();
}
```

Once a user's input is detected, the square's horizontal velocity is changed to reflect the desired motion. The initial velocity is 0 by default so that the user may choose their starting direction.


### PLATFORM GENERATION
```javascript
class Platform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.width = 45;
        this.height = 10;

        this.render = () => {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function createPlatforms(y) {
    let randX = Math.floor(Math.random() * (game.width - 40));
    let plat = new Platform(randX, y);
    platforms.push(plat);
}

function generateNewPlatforms() {
    let onScreen = platforms.length;
    if (onScreen < 12) {
        createPlatforms(-10);
    }
}
```

All platforms are pushed to an array once created. If this array is less than a set value, a new platform is generated offscreen where it will eventually move into view. The platfroms are spawned randomly across the game's width, making each game unique.

---

## A LOOK TO THE FUTURE
These are some features I would like to implement.

### DIFFICULTY SELECTION
Some people may not find the current game speed to be suitable. I would like to give user's the options to choose between an easy, medium, and hard setting as well as a custom mode.

### POWER-UPS
Wouldn't it be nice to suddenly increase your score by 300 points? Or maybe you lost after almost beating your high score, but thankfully you had another chance? I'd like to implement these powerups to further enhance the user's experience.

### ENEMIES
I'd like to include enemies that move alongside the platforms. If the user hits them from below, the game is over. However, if hit from above, the user bounces off using the now destroyed enemy as a platform.

### CUSTOM SPRITES
While not a feature that impacts gameplay, I'd like to change the cosmetic to have a more personal touch.

---

## WIREFRAME
![whiteboard](/images/whiteboard.png)

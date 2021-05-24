# E-Commerce Web Application
* An E-Commerce Web Application developed using Node.js, Express, MongoDB and Handlebars templating engine, modelled on MVC architecture pattern to separate data-models from business logic(controllers) and views.
* Website Hosted at: https://shoppingcart-deploy.herokuapp.com/ (hosted using Heroku Platform)
* Features: Browse Products added by Different Users, Signup/Login to Add Products to Cart or Order Products & Add or Edit your Own Products.

![](/public/ShoppingCart1.png)
![](/public/ShoppingCart2.png)

### Tech-Stack
Main web-frameworks and libraries:
* **Node.js**: Server-side JavaScript execution environment to produce dynamic web pages and service requests.
* **Express.js**: The de facto standard web application framework for Node.js to build web applications including this one.
* **MongoDB(& mongoose.js)**: NoSQL database, which serves as the database for this tech stack, for storing and retrieving data(CRUD opreations).
* **Handlebars.js(& Bootstrap)**: Templating engine to produce client-side generated dynamic web pages, used to separate UI(view) from logic(model and controller)
* Express Messages, Session, Connect Flash & Validation
* Passport.js Authentication
* BCrypt Hashing

### How to Host the E-Commerce Website locally on your system

#### 1. Cloning the repository & Installing Required Files
Download and Install node.js and npm. Clone the repository & Install the dependencies using command-line.
``` 
git clone https://github.com/knightwayne/Ecommerce-Website.git
npm install
```

#### 2. Starting the Server
Start Node.js server using npm, the server starts processing request at http://localhost:3000 .
```
npm start
```

#### 3. Stopping the Server
 Find the process ID and kill the process to stop the node server.
```
ps aux | grep node
kill -9 PROCESS_ID
```

### Improvements & Known Bugs
* Image URL shows absolute path(instead of relative path) when product is edited by admin.
* Invoice Not Generated properly
* ~~Authentication~~ & Authorization
* Handling Payments with Stripe.js or other similar framework

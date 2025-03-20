const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const authenticateToken = require('../middleware/checkAuth');
const { body, validationResult } = require('express-validator');
const sanitize = require('validator').escape;

router.use(cookieParser());
router.use(bodyParser.json());



// ==== Unrelated test requsets ==== //

router.get('/send_some_msg', (req, res) => {
  let text = req.query.text;

  fs.appendFile("saved_text.txt", text + '\n', (err) => {
    if (err) {
      return res.status(500).send("Error saving the file.");
    }
    res.send("Text saved successfully!");
  });
})

router.get('/SuperDuperSecretLog', (req, res) => {
  fs.readFile("saved_text.txt", "utf8", (err, data) => {
    if (err) {
        return res.status(500).send("Error reading the file.");
    }
    res.send(`<h1>Saved Text:</h1><pre>${data}</pre>`);
});
})

// ==== End of unrelated test requests ==== //



router.get('/',authenticateToken, (req,res) => {
    const file = path.join(__dirname + '../../../public/homePage/home.html')
    res.sendFile(file);
})

router.get('/checkAuth', authenticateToken, (req,res) => {
    res.send('user logged');
})

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,  
      secure: false,   
      sameSite: 'Strict',
      maxAge: 0,  
      path: '/'    
    });    
    res.json({ message: 'logged out successfully' });
});
  
  
router.post('/getAllProducts', async (req, res) => {
    try {
        let productsList = await products.find();
        res.json(productsList);
    } catch (error) {
        console.error(error);
    }
})

router.post('/getProductDetails', async (req, res) => {
    const { productName } = req.body;
    try {
        let product = await products.findOne({productName: productName});
        res.json(product);
    } catch (error) {
        console.error(error);
    }
})


router.post(
  '/addToCart',
  authenticateToken,
  [
    body('productName')
      .notEmpty()
      .withMessage('product name is required')
      .customSanitizer((value) => sanitize(value))
      .custom(async (value, { req }) => {
        try {
          const product = await products.findOne({ productName: value });
          if (!product) {
            throw new Error('product does not exist');
          }
          req.product = product; // Attach product to the request for reuse
        } catch (error) {
          throw new Error('invalid product name');
        }
      })
      .withMessage('Product name must be valid'),

    body('quantity')
      .notEmpty()
      .withMessage('quantity is required')
      .isInt({ min: 1 })
      .withMessage('quantity must be an integer greater than 0'),

    body('price')
      .notEmpty()
      .withMessage('price is required')
      .isNumeric()
      .withMessage('price must be a number')
      .custom((value, { req }) => {
        if (!req.product || req.product.price != value) {
          throw new Error('invalid price for the selected product');
        }
        return true;
      }),

    body('color')
      .notEmpty()
      .withMessage('color is required')
      .customSanitizer((value) => sanitize(value))
      .custom((value, { req }) => {
        if (!req.product || !req.product.colors.includes(value)) {
          throw new Error('invalid color for the selected product');
        }
        return true;
      }),

    body('size')
      .notEmpty()
      .withMessage('size is required')
      .customSanitizer((value) => sanitize(value))
      .custom((value, { req }) => {
        if (!req.product || !req.product.sizes.includes(value)) {
          throw new Error('invalid size for the selected product');
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productName, price, color, size, quantity } = req.body;

    try {
      // search or create an order
      let order = await orders.findOne({ customerName: req.user.name });

      if (!order) {
        await orders.create({
          products: [{ productName, price, color, size, quantity }],
          totalPrice: price * quantity,
          customerName: req.user.name,
          orderId: '',
        });
        return res.json({ message: 'product added to cart successfully' });
      }

      if (order.isConfirmed) {
        return res.json({message: 'you have already confirmed your order, you cant add more products'});
      }

      // update existing order
      const updatedOrder = await orders.updateOne(
        { customerName: req.user.name },
        {
          $push: {
            products: [{ productName, price, quantity, color, size }],
          },
          totalPrice: order.totalPrice + price * quantity,
        }
      );

      if (updatedOrder.modifiedCount === 0) {
        return res.json({ message: 'order not found or not updated' });
      }

      return res.json({ message: 'product added to cart successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'something went wrong' });
    }
  }
);

module.exports = router;

const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const authenticateToken = require('../middleware/checkAuth');
const { body, validationResult } = require('express-validator');

router.use(cookieParser());
router.use(bodyParser.json());

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

const { body, validationResult } = require('express-validator');
const sanitize = require('validator').escape;

router.post(
  '/addToCart',
  authenticateToken,
  [
    body('productName')
      .notEmpty()
      .withMessage('Product name is required')
      .customSanitizer((value) => sanitize(value))
      .custom(async (value, { req }) => {
        try {
          const product = await products.findOne({ productName: value });
          if (!product) {
            throw new Error('Product does not exist');
          }
          req.product = product; // Attach product to the request for reuse
        } catch (error) {
          throw new Error('Invalid product name');
        }
      })
      .withMessage('Product name must be valid'),

    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 1 })
      .withMessage('Quantity must be an integer greater than 0'),

    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom((value, { req }) => {
        if (!req.product || req.product.price != value) {
          throw new Error('Invalid price for the selected product');
        }
        return true;
      }),

    body('color')
      .notEmpty()
      .withMessage('Color is required')
      .customSanitizer((value) => sanitize(value))
      .custom((value, { req }) => {
        if (!req.product || !req.product.colors.includes(value)) {
          throw new Error('Invalid color for the selected product');
        }
        return true;
      }),

    body('size')
      .notEmpty()
      .withMessage('Size is required')
      .customSanitizer((value) => sanitize(value))
      .custom((value, { req }) => {
        if (!req.product || !req.product.sizes.includes(value)) {
          throw new Error('Invalid size for the selected product');
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
      // Search or create an order
      let order = await orders.findOne({ customerName: req.user.name });

      if (!order) {
        await orders.create({
          products: [{ productName, price, color, size, quantity }],
          customerName: req.user.name,
        });
        return res.json({ message: 'Product added to cart successfully' });
      }

      if (order.isConfirmed) {
        return res.json({
          message: 'You have already confirmed your order, you can’t add more products',
        });
      }

      // Update existing order
      const updatedOrder = await orders.updateOne(
        { customerName: req.user.name },
        {
          $push: {
            products: [{ productName, price, quantity, color, size }],
          },
        }
      );

      if (updatedOrder.modifiedCount === 0) {
        return res.json({ message: 'Order not found or not updated' });
      }

      return res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
);


module.exports = router;
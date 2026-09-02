# SajiloMart

SajiloMart is a full-stack e-commerce application with a React/Vite storefront, an Express API, and MongoDB persistence.

## Overview

SajiloMart provides a shopping experience for browsing products, filtering and searching inventory, managing a cart, placing orders, and reviewing purchases. It also includes an admin dashboard for managing products and orders, viewing sales metrics, and updating store settings.

The project is intended for customers using the storefront and administrators operating the store. The frontend and backend are maintained as separate Node.js applications in this repository.

## Features

### Customer features

- Register and sign in with an email and password
- Reset a forgotten password using an email OTP
- Browse paginated, non-blacklisted products
- Search products, filter by category, and filter by maximum price
- View product details, images, stock, colors, ratings, and reviews
- Add products to a Redux-managed cart, change quantities, remove items, and clear the cart
- Complete checkout with customer details, address, shipping, tax, and discount calculations
- Place cash-on-delivery orders
- Initiate and verify eSewa payments
- View order history
- Download order receipts as PDF files
- Create, edit, and delete product reviews
- Use light, dark, or system theme settings
- Use responsive navigation and a mobile menu

### Admin features

- Register and sign in as an administrator
- Access a protected dashboard
- Create products with up to five uploaded images
- Store product images in Cloudinary
- Edit and delete products
- Blacklist and unblacklist products through the API
- View paginated orders and update order statuses
- View sales, user, order, active-order, recent-order, and six-month category metrics
- View dashboard notifications derived from order data
- Change the administrator username and password
- Log out and change the dashboard theme

## Tech Stack

### Frontend

- React 19 and React DOM
- Vite 7
- React Router DOM 7
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS, PostCSS, and `tailwindcss-animate`
- Radix UI primitives and shadcn/ui-style components
- Framer Motion, Lucide React, Recharts, and Embla Carousel
- `pdf-lib` for PDF order receipts
- Sonner and React Toastify for notifications

### Backend

- Node.js
- Express 5
- Mongoose 9
- Axios for payment-provider requests
- Multer for multipart image uploads
- Nodemailer with Gmail SMTP for password-reset email
- CORS and Cookie Parser
- Helmet, Express Rate Limit, `express-mongo-sanitize`, and `xss-clean`

### Database and services

- MongoDB, accessed through Mongoose
- Cloudinary for product image storage
- eSewa for payment initiation and payment-status verification
- Gmail SMTP for password-reset OTP delivery

### Authentication

- JSON Web Tokens signed with `JWT_SECRET`
- Bcrypt password hashing
- HTTP-only `token` cookies, with Bearer-token support in the API
- Separate `user` and `admin` roles

## Project Structure

```text
sajilomart/
├── backend/
│   ├── controllers/       Request handlers for auth, products, orders, payments, reviews, pincodes, and settings
│   ├── database/          MongoDB connection
│   ├── middleware/        JWT verification and Multer upload configuration
│   ├── models/            Mongoose schemas and models
│   ├── routes/            Express route modules mounted under /api
│   ├── utils/             Cloudinary, crypto, constants, and password-hashing helpers
│   ├── .env.example       Backend environment-variable template
│   └── index.js            Express app, middleware, route loading, and server startup
├── navbar/                Additional navigation components
├── public/                Static frontend assets
├── src/
│   ├── components/        Shared UI, navigation, cart, checkout, and dashboard components
│   ├── const/              Shared constants and help content
│   ├── hooks/              React hooks and eSewa integration hook
│   ├── page/               Storefront, authentication, checkout, payment, and order pages
│   ├── Redux/              Redux store, selectors, auth, cart, and product slices
│   ├── SiteLayout/         Store and admin dashboard layouts
│   ├── App.jsx             React Router configuration
│   ├── index.css           Global styles
│   └── main.jsx            Frontend entry point
├── index.html              Vite HTML entry point
├── vite.config.js          Vite configuration and @ alias
├── tailwind.config.js      Tailwind configuration
├── postcss.config.js       PostCSS configuration
├── eslint.config.js        ESLint configuration
└── package.json            Frontend scripts and dependencies
```

The repository root also contains a package manifest with a `nodemon` development dependency, but application scripts are defined in `sajilomart/package.json` and `sajilomart/backend/package.json`.

## Prerequisites

- Node.js with npm. The package manifests do not specify an exact Node.js version; use a current LTS release compatible with Vite 7 and the listed packages.
- A MongoDB deployment, either local MongoDB or MongoDB Atlas
- A Cloudinary account for admin product-image uploads
- A Gmail account configured for SMTP, preferably using an app password, for password-reset OTP email
- eSewa merchant credentials and callback/status URLs for payment flows

## Installation and Setup

### 1. Clone the repository

No remote repository URL is stored in the project configuration. Replace the placeholder with the repository URL before running the command:

```bash
git clone <repository-url>
cd <repository-directory>/sajilomart
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Edit `backend/.env` with the values described below. The backend creates `tmp/uploads` automatically for temporary Multer files. Ensure the MongoDB database is reachable before starting the server.

### 4. Configure the frontend

Create `sajilomart/.env` with the frontend API URL. The backend routes are mounted under `/api`:

```dotenv
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

### 5. Start the backend

From `sajilomart/backend`:

```bash
npm run dev
```

The server listens on `PORT`, defaulting to `3000`.

### 6. Start the frontend

Open a second terminal and run this from `sajilomart`:

```bash
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. The backend allows that origin by default when `CLIENT_URL` is not set.

### Production build and preview

From `sajilomart`:

```bash
npm run build
npm run preview
```

The backend has no separate production script. `node index.js` runs the server directly; `npm run start` runs it through Nodemon and is intended for development.

## Environment Variables

Never commit `.env` files or replace these placeholders with real credentials in documentation.

### Backend: `backend/.env`

```dotenv
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

GMAIL_USER=your_email@example.com
GMAIL_PASS=your_gmail_app_password

ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_SECRET_KEY=your_esewa_secret_key
ESEWA_PAYMENT_URL=your_esewa_payment_url
ESEWA_PAYMENT_STATUS_CHECK_URL=your_esewa_status_check_url
SUCCESS_URL=http://localhost:5173/payment-success
FAILURE_URL=http://localhost:5173/payment-failure

KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_PAYMENT_URL=your_khalti_payment_url
KHALTI_VERIFICATION_URL=your_khalti_verification_url
```

`NODE_ENV` controls whether authentication cookies use the `secure` flag. Khalti variables are present in the environment template and order schema, but the current payment controller accepts only `esewa` and does not make Khalti requests.

### Frontend: `sajilomart/.env`

```dotenv
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

`VITE_CLOUDINARY_CLOUD_NAME` is referenced by the image URL helper. Do not place private Cloudinary credentials or any secret in frontend environment variables.

## How to Use

### Customer flow

1. Open the storefront and browse or search products.
2. Open a product detail page, choose a quantity, and add the product to the cart.
3. Sign up or log in, then open checkout and provide delivery details.
4. Choose cash on delivery or start the eSewa payment flow.
5. Review order history at `/order`; completed orders can generate a PDF receipt.
6. Submit reviews from the product experience when authenticated as a regular user.

Useful storefront routes include `/`, `/products`, `/product/:prodname`, `/checkout`, `/Login`, `/Signup`, `/forgot-password`, `/order`, `/About`, and `/Services`.

### Admin flow

1. Register through the admin signup API or log in at `/adminlogin`.
2. Use `/dashboard` to access the protected dashboard.
3. Manage products at `/dashboard/addproducts` and `/dashboard/productsmanagement`.
4. Manage orders at `/dashboard/orderManagement`.
5. View metrics at `/dashboard/performanceMatrix`, notifications at `/dashboard/notifications`, and account settings at `/dashboard/storesettings`.

## API Documentation

The Express server returns `GET /` as a simple health response. Route modules are loaded from `backend/routes` and mounted under `/api`, so the API base URL is `http://localhost:3000/api` by default.

Protected endpoints accept either `Authorization: Bearer <jwt>` or the HTTP-only `token` cookie. Admin- and user-specific authorization is checked in the controllers.

### Authentication

| Method | Endpoint          | Access | Purpose                                             |
| ------ | ----------------- | ------ | --------------------------------------------------- |
| POST   | `/signup`         | Public | Register a customer                                 |
| POST   | `/login`          | Public | Authenticate a customer and issue a 7-day JWT       |
| POST   | `/adminsignup`    | Public | Register an administrator                           |
| POST   | `/adminlogin`     | Public | Authenticate an administrator and issue a 1-day JWT |
| POST   | `/send-otp`       | Public | Send a password-reset OTP through Gmail SMTP        |
| POST   | `/verify-otp`     | Public | Verify a customer password-reset OTP                |
| POST   | `/reset-password` | Public | Reset a customer password using an OTP              |

### Products

| Method | Endpoint                     | Access      | Purpose                                                                     |
| ------ | ---------------------------- | ----------- | --------------------------------------------------------------------------- |
| POST   | `/create-product`            | JWT + admin | Create a product and upload up to five images                               |
| PUT    | `/update-product/:id`        | JWT + admin | Update product data                                                         |
| DELETE | `/delete-product/:id`        | JWT + admin | Delete a product                                                            |
| PUT    | `/blacklist-product/:id`     | JWT + admin | Mark a product as blacklisted                                               |
| PUT    | `/remove-from-blacklist/:id` | JWT + admin | Remove a product from the blacklist                                         |
| GET    | `/get-product`               | Public      | List products with search, category, price, and pagination query parameters |
| GET    | `/get-product-by-name/:name` | Public      | Find a product by normalized name                                           |

### Orders and dashboard

| Method | Endpoint                 | Access      | Purpose                                                                                                             |
| ------ | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| POST   | `/createorder`           | JWT         | Create an order for the authenticated user                                                                          |
| GET    | `/getordersbyuserid`     | JWT         | Return the authenticated user's orders                                                                              |
| GET    | `/getallorders`          | JWT + admin | Return paginated orders with user and product data                                                                  |
| PUT    | `/updateorderstatus/:id` | JWT + admin | Update an order status                                                                                              |
| GET    | `/getmetrics`            | JWT + admin | Return sales, user, order, recent-order, and six-month category metrics; accepts optional `startDate` and `endDate` |

### Reviews and delivery pincodes

| Method | Endpoint               | Access      | Purpose                                            |
| ------ | ---------------------- | ----------- | -------------------------------------------------- |
| GET    | `/getreviews/:id`      | Public      | Get reviews for a product                          |
| POST   | `/createreview`        | JWT + user  | Create a product review and recalculate its rating |
| PUT    | `/updatereview/:id`    | JWT + user  | Update review text                                 |
| DELETE | `/deletereview/:id`    | JWT + user  | Delete a review and recalculate the product rating |
| POST   | `/replyreview/:id`     | JWT + admin | Add an administrator reply to a review             |
| POST   | `/addpincode`          | JWT + admin | Add delivery pincodes                              |
| GET    | `/getpincode/:pincode` | Public      | Check whether a delivery pincode exists            |

### Payments and settings

| Method | Endpoint            | Access      | Purpose                                                                |
| ------ | ------------------- | ----------- | ---------------------------------------------------------------------- |
| POST   | `/initiate-payment` | Public      | Initiate the eSewa payment flow and create a pending transaction       |
| POST   | `/payment-status`   | Public      | Check eSewa transaction status and update the transaction record       |
| PUT    | `/change-username`  | JWT + admin | Change the authenticated administrator username                        |
| PUT    | `/change-password`  | JWT + admin | Change the administrator password after checking the previous password |

The payment route is currently registered by two route files with the same endpoint definitions. Clients should use the paths above; the duplicate registration does not create a different public API path.

## Database

MongoDB is connected through Mongoose using `MONGO_URI`. The active models are:

- `User`: customer identity, hashed password, optional phone, OTP, role, and purchase references
- `Admin`: administrator username, hashed password, and admin role
- `Product`: name, description, price, category, images, stock, colors, rating, reviews, and blacklist state
- `Order`: amount, address, customer details, payment method, ordered products, user reference, payment fields, and order status
- `Review`: product reference, review text, 1-5 rating, user reference, and administrator replies
- `Pincode`: unique delivery pincode and optional area, district, and state
- `Code`: unique code value with timestamps
- `transaction`: payment customer details, product details, amount, gateway, and transaction status

`backend/models/Transaction.js` contains a commented-out transaction schema and is not the active exported model. The active transaction model is `backend/models/payment.js`.

## Authentication and Authorization

Customer and admin passwords are hashed with Bcrypt before storage. Successful login signs a JWT containing the account ID and role. Customer tokens expire after seven days; admin tokens expire after one day.

The `verifyToken` middleware reads a Bearer token from the `Authorization` header or falls back to the `token` cookie. It verifies the JWT with `JWT_SECRET` and exposes the decoded ID and role on the request. Controllers then enforce `user` or `admin` access where required. Login responses also return the token, and the frontend stores authentication state in Redux/local storage.

Admin signup is publicly reachable in the current API. There is no invitation or bootstrap restriction implemented for that endpoint.

## Scripts

Run frontend scripts from `sajilomart/`:

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build the frontend for production    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the frontend       |

Run backend scripts from `sajilomart/backend/`:

| Command         | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`   | Start the Node.js API with `node index.js`                                              |
| `npm run start` | Start the API through Nodemon                                                           |
| `npm test`      | Exits with an intentional `no test specified` error; automated tests are not configured |

## Screenshots and Demo

Screenshots and a live deployment URL are not included in the repository. Add them here when a deployment or image assets are available.

## Security Notes

- Keep `.env` files out of version control; the project `.gitignore` excludes them.
- Never expose JWT secrets, database credentials, Cloudinary secrets, Gmail credentials, or payment-provider secrets.
- Use Gmail app passwords rather than a primary account password for SMTP.
- The backend enables Helmet, CORS credentials, request rate limiting, MongoDB query sanitization, XSS cleaning, and HTTP-only cookies.
- Set `NODE_ENV=production` and use HTTPS in production so secure authentication cookies work as intended.
- Review and restrict the publicly reachable admin-signup endpoint before production deployment.

## Future Improvements

These items are not currently implemented or complete:

- Add automated backend and frontend tests and configure CI checks.
- Add request validation and consistent authorization helpers across controllers.
- Restrict or remove public admin registration.
- Complete Khalti integration or remove unused Khalti configuration and schema fields.
- Add payment authentication and stronger transaction-to-order reconciliation.
- Add server-side OTP expiry and one-time-use enforcement.
- Add ownership checks so users can only edit or delete their own reviews.
- Add image replacement/deletion handling when products are edited or deleted.
- Add a documented deployment process and a real demo URL.
- Resolve inconsistent route casing in some frontend links before deploying to case-sensitive hosting.

## Contributing

1. Fork the repository and create a feature branch.
2. Install frontend and backend dependencies using the setup steps above.
3. Keep secrets in local `.env` files and never commit them.
4. Make focused changes and run `npm run lint` and `npm run build` from `sajilomart/`.
5. Test the affected API flow locally, then open a pull request describing the change.

## License

The backend package metadata declares the ISC license, but no `LICENSE` file is included in the repository. Confirm the intended repository-wide license before distributing the project.

## Author

Diwash

GitHub: https://github.com/diwash-dev

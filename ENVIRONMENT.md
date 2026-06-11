# Environment Variables Configuration

This project uses environment variables to handle configuration across different environments (development, staging, production).

## Backend (.env)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port the backend server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET`| Stripe Webhook Signing Secret | `whsec_...` |
| `FRONTEND_URL` | The URL of the frontend application | `http://localhost:3000` |
| `AWS_REGION` | AWS Region (optional for S3) | `ap-south-1` |
| `AWS_ACCESS_KEY` | AWS Access Key (optional for S3) | `AKIA...` |
| `AWS_SECRET_KEY` | AWS Secret Key (optional for S3) | `...` |
| `AWS_BUCKET_NAME` | AWS S3 Bucket Name (optional) | `my-bucket` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Frontend (.env.local)

Note: All frontend variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The base URL for the backend API | `http://localhost:5000` |
| `NEXT_PUBLIC_FRONTEND_URL` | The base URL for the frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key | `pk_test_...` |

## Docker Build Arguments

When building Docker images, ensure the following arguments are passed for the frontend:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_FRONTEND_URL`

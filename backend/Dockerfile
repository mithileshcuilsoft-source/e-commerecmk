# Use Node.js 22 as the base image
FROM node:22-slim

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
# If you have devDependencies like nodemon, they won't be installed
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application using 'node' for performance and stability in production
CMD ["node", "index.js"]
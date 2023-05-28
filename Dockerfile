# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the desired port (replace 3000 with your app's port if necessary)
EXPOSE 3000

# Define the command to run your app (replace "start" with the appropriate command for your React app)
CMD [ "npm", "start" ]

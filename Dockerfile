# Use the official Node.js image as the base image
FROM node:12

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the rest of the Docusaurus project files to the container
COPY . . 

WORKDIR /usr/src/app/website

# Install dependencies
RUN npm ci

# Build the Docusaurus project
RUN npm run build

# Expose port 3000, the default port for Docusaurus
EXPOSE 3000

# Start the Docusaurus application
CMD ["npm", "run", "serve"]

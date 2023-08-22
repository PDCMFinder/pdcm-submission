# Use the official Node.js image as the base image
FROM node:16

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


# FROM node:12

# WORKDIR /usr/src/app

# COPY . .

# Set env variables here (none to worry about today)
#RUN cd website && npm ci && npm run build

# FROM nginx:alpine

# needs shadow to get usermod and groupmod
# RUN apk --no-cache add shadow

# Build the React app
# RUN npm run build
#EXPOSE 3000

#WORKDIR /usr/src/app/website
# Set the command to run when the container starts
#CMD ["npm", "start"]

# we're using numeric user to match kubernetes
# RUN usermod -u 9999 nginx
# RUN groupmod -g 9999 nginx

# COPY --from=0 /app/website/build /usr/share/nginx/html
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# RUN chown -R nginx:nginx /var/cache/nginx
# RUN chown -R nginx:nginx /var/log/nginx
# RUN chown -R nginx:nginx /etc/nginx/conf.d
# RUN touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid

# USER 9999

# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]

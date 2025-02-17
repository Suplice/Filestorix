# NODE image base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install


# Copy source code
COPY . .



# Start the app
CMD ["npm","run", "dev"]
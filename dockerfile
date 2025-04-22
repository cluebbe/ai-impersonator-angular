# Use the official Nginx image as the base
FROM nginx:alpine

# Copy the built Angular app to Nginx's default public directory
COPY dist/ai-impersonator-angular/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
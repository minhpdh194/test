# Sử dụng Node.js làm hình ảnh cơ sở
FROM node:18 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Xây dựng ứng dụng cho môi trường sản xuất
RUN npm run build

# Giai đoạn chạy ứng dụng
FROM node:18

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép toàn bộ mã nguồn và các file đã xây dựng
COPY --from=build /app .

# Cài đặt lại các phụ thuộc (nếu cần)
RUN npm install --production

# Cài riêng Vite cho preview
RUN npm install vite

# Expose cổng 3000 cho lệnh preview
EXPOSE 3000

# Khởi động ứng dụng với lệnh preview
CMD ["npm", "run", "preview"]

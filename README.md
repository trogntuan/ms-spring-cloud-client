# OAuth2 Microservice Authentication Demo

Đây là một ứng dụng React demo để minh họa chức năng authentication và authorization sử dụng OAuth2 Authorization Code flow cho hệ thống microservice.

## Tính năng

- **OAuth2 Authorization Code Flow**: Đăng nhập sử dụng OAuth2 Authorization Code Grant
- **Protected Routes**: Bảo vệ các route cần authentication
- **User Information**: Hiển thị thông tin user từ Auth Context và API
- **API Integration**: Gọi API protected endpoint từ user-service
- **Modern UI**: Giao diện đẹp và responsive

## Cấu trúc Project

```
src/
├── components/
│   ├── Login.tsx          # Component đăng nhập OAuth2
│   ├── Login.css          # Styles cho Login
│   ├── Callback.tsx       # Component xử lý OAuth2 callback
│   ├── Callback.css       # Styles cho Callback
│   ├── Home.tsx           # Component trang chủ
│   ├── Home.css           # Styles cho Home
│   └── ProtectedRoute.tsx # Component bảo vệ route
├── contexts/
│   └── AuthContext.tsx    # Context quản lý authentication
├── services/
│   └── api.ts             # Service gọi API với OAuth2
├── types/
│   └── index.ts           # TypeScript interfaces
└── App.tsx                # Component chính
```

## OAuth2 Configuration

### Authorization Server
- **URL:** `http://localhost:9000`
- **Client ID:** `ipt`
- **Client Secret:** `q1w2e3r4`
- **Redirect URI:** `http://localhost:3000/callback`
- **Scopes:** `READ WRITE`
- **Response Type:** `code`
- **Response Mode:** `form_post`

### API Endpoints

#### OAuth2 Authorization Endpoint
```
GET http://localhost:9000/oauth2/authorize
?client_id=ipt
&redirect_uri=http://localhost:3000/callback
&scope=READ%20WRITE
&response_type=code
&response_mode=form_post
&state={random_state}
&nonce={random_nonce}
```

#### OAuth2 Token Endpoint
```
POST http://localhost:9000/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=ipt
&client_secret=q1w2e3r4
&code={authorization_code}
&redirect_uri=http://localhost:3000/callback
```

#### User Service Endpoint
```
GET http://localhost:8082/user-service/info
Authorization: Bearer {access_token}
```

**Authorization Requirements:**
- Scope: `SCOPE_READ`
- Roles: `ADMIN` hoặc `USER`

## Cài đặt và Chạy

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file .env:**
```bash
# Tạo file .env trong thư mục gốc của project
touch .env
```

3. **Cấu hình Environment Variables:**
Thêm các dòng sau vào file `.env`:
```env
# OAuth2 Configuration
VITE_OAUTH2_SERVER_URL=http://localhost:9000
VITE_API_BASE_URL=http://localhost:8082
VITE_CLIENT_ID=ipt
VITE_CLIENT_SECRET=q1w2e3r4
VITE_REDIRECT_URI=http://localhost:3000/callback
```

4. **Chạy development server:**
```bash
npm run dev
```

5. **Truy cập ứng dụng:**
```
http://localhost:3000
```

## OAuth2 Authorization Code Flow

1. **Login Page**: User click "Login with OAuth2"
2. **Authorization Request**: Redirect đến `localhost:9000/oauth2/authorize`
3. **User Authentication**: User đăng nhập trên OAuth2 server
4. **Authorization Code**: OAuth2 server redirect về `/callback` với authorization code
5. **Token Exchange**: Frontend exchange code cho access token
6. **API Calls**: Sử dụng access token để gọi API

## Backend Requirements

Để ứng dụng hoạt động, bạn cần có:

### OAuth2 Authorization Server (localhost:9000)
- Endpoint: `/oauth2/authorize`
- Endpoint: `/oauth2/token`
- Client ID: `ipt`
- Client Secret: `q1w2e3r4`
- Redirect URI: `http://localhost:3000/callback`

### User Service (localhost:8082)
- Endpoint: `/user-service/info`
- Authorization: `@PreAuthorize("hasAuthority('SCOPE_READ') && hasAnyRole('ADMIN','USER')")`
- Response: `ApiResponse<UserDto>`

### UserDto Structure
```java
public class UserDto {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private BigDecimal pointAmount;
    private Long accountId;
}
```

## CORS Configuration

### OAuth2 Server (localhost:9000)
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### User Service (localhost:8082)
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Security Features

- **OAuth2 Authorization Code Flow**: Secure authentication flow
- **Token-based Authentication**: Sử dụng OAuth2 Bearer tokens
- **Automatic Token Refresh**: Tự động xử lý token expiration
- **Protected Routes**: Redirect về login nếu chưa authenticated
- **Error Handling**: Xử lý lỗi authentication và API calls
- **Local Storage**: Lưu trữ token và user info
- **Environment Variables**: Bảo mật thông tin nhạy cảm

## Development

### Environment Variables
Tạo file `.env` trong thư mục gốc của project:
```env
# OAuth2 Configuration
VITE_OAUTH2_SERVER_URL=http://localhost:9000
VITE_API_BASE_URL=http://localhost:8082
VITE_CLIENT_ID=ipt
VITE_CLIENT_SECRET=q1w2e3r4
VITE_REDIRECT_URI=http://localhost:3000/callback
```

**Lưu ý:** 
- File `.env` sẽ được git ignore để bảo mật
- Các biến môi trường phải bắt đầu bằng `VITE_` để Vite có thể đọc được
- Nếu không có file `.env`, app sẽ sử dụng giá trị mặc định

### Build Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Troubleshooting

### CORS Errors
- Đảm bảo OAuth2 server đã cấu hình CORS cho `localhost:3000`
- Kiểm tra user service đã cấu hình CORS cho `localhost:3000`

### OAuth2 Errors
- Kiểm tra OAuth2 server đang chạy trên `localhost:9000`
- Verify client ID `ipt` và client secret `q1w2e3r4`
- Kiểm tra redirect URI `http://localhost:3000/callback`
- Đảm bảo file `.env` đã được tạo và cấu hình đúng

### API Errors
- Đảm bảo user-service đang chạy trên `localhost:8082`
- Kiểm tra authorization requirements
- Verify Bearer token format

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

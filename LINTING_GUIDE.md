# Hướng dẫn Linting và Formatting

## Các lệnh npm đã được cấu hình:

### 1. Linting cơ bản:

```bash
npm run lint           # Kiểm tra lỗi ESLint
npm run lint:fix       # Tự động fix các lỗi ESLint có thể fix được
npm run lint:check     # Kiểm tra lỗi ESLint ở chế độ quiet
```

### 2. Type checking:

```bash
npm run type-check     # Kiểm tra lỗi TypeScript
```

### 3. Code formatting:

```bash
npm run format         # Format tất cả files với Prettier
npm run format:check   # Kiểm tra format của code
```

## Tự động hóa:

### 1. VSCode (nếu đã cài extensions):

- Code sẽ tự động format khi save file
- ESLint sẽ tự động fix các lỗi đơn giản khi save
- Imports sẽ được organize tự động

### 2. Pre-commit hook:

- Khi commit code, husky sẽ tự động chạy:
  - ESLint --fix trên các files .js/.jsx/.ts/.tsx
  - Prettier format trên tất cả các files

## Cấu hình đã thêm:

### ESLint Rules:

- `@typescript-eslint/no-unused-vars`: Cảnh báo về biến không sử dụng
- `@typescript-eslint/no-explicit-any`: Cảnh báo về việc sử dụng `any`
- `@next/next/no-img-element`: Cảnh báo về việc sử dụng `<img>` thay vì `<Image>`
- `prefer-const`: Yêu cầu sử dụng `const` thay vì `let` khi có thể
- `no-console`: Cảnh báo về việc sử dụng `console.log`

### Prettier Config:

- Semi-colons: Có
- Single quotes: Có
- Tab width: 2 spaces
- Print width: 80 characters
- Trailing commas: ES5 style

## Khuyến nghị:

### Để fix các unused variables:

1. Xóa các import/variable không cần thiết
2. Hoặc thêm prefix `_` vào tên biến (VD: `_error` thay vì `error`)

### Để fix console.log warnings:

1. Xóa các console.log không cần thiết
2. Hoặc comment lại: `// eslint-disable-next-line no-console`

### Extensions VSCode khuyến nghị:

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Path Intellisense

## Sử dụng:

```bash
# Trước khi commit
npm run lint:fix && npm run format

# Kiểm tra toàn bộ project
npm run type-check && npm run lint:check && npm run format:check
```

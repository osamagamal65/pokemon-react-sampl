# Pokemon Go React App

A React-based Pokemon Go application built with TypeScript, Redux Toolkit, and RTK Query for efficient state management and API data fetching.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later) or [Yarn](https://yarnpkg.com/)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/pokemon-go-react.git](https://github.com/your-username/pokemon-go-react.git)
   cd pokemon-go-react 
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173` to access the application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Structure

src/
  ├── features/            # Feature modules
  │   └── Pokmen/          # Pokemon feature
  │       ├── __tests__/   # Test files
  │       ├── pokmenApi.ts # API slice
  │       └── pokmenSlice.ts # Redux slice
  ├── store.ts             # Redux store
  └── App

## Testing

To run tests, use the following command:
```bash
npm run test
```

To run tests with coverage, use the following command:
```bash
npm run test:coverage
```

To run tests with UI, use the following command:
```bash
npm run test:ui
```

To run tests with coverage, use the following command:
```bash
npm run test:coverage
```

To run tests with coverage, use the following command:
```bash
npm run test:coverage
```

    
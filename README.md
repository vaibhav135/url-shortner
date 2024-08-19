# url-shortner
A simple URL shortener built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS.

## Features
- **Shorten URLs**: Create short links for long URLs.
- **Redirection**: Redirect to the original URL when accessing the short link.
- **API**: REST API for shortening URLs programmatically.
- **QR Code Generation**: Instantly generate a QR code for each short link, allowing for quick access on mobile devices.

## Installation

1. Clone the repository:

    
```bash
git clone https://github.com/vaibhav135/url-shortner.git
cd url-shortner
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   Create a .env file in the root directory and configure the required environment variables (e.g., database connection, API keys).

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Usage

Access the application in your browser at http://localhost:3000.
Use the form to shorten your URL.
Use the generated short link to be redirected to the original URL.

## Technologies Used

- **Next.js**: Framework for building server-side rendered React applications.
- **TypeScript**: Typed superset of JavaScript for better code quality.
- **PostgreSQL**: Database for storing URLs and their short versions.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
License

This project is licensed under the MIT License.

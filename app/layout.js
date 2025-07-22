import Auth0ProviderWrapper from './Auth0Provider';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Auth0ProviderWrapper>
          <ServiceWorkerRegister /> 
          {children}
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}

'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export default function Auth0ProviderWrapper({ children }) {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
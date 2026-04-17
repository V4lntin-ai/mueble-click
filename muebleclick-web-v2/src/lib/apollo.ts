import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { Observable } from 'rxjs';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/graphql';

const REFRESH_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      access_token
      refresh_token
    }
  }
`;

async function renovarToken(): Promise<string | null> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return null;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { input: { refresh_token } },
      }),
    });
    const { data, errors } = await res.json();
    if (errors || !data?.refreshToken) return null;
    const { access_token, refresh_token: newRefresh } = data.refreshToken;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', newRefresh);
    return access_token;
  } catch {
    return null;
  }
}

const httpLink = createHttpLink({ uri: API_URL });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const isUnauthenticated = error.errors.some(
      (e) => e.extensions?.code === 'UNAUTHENTICATED',
    );
    if (isUnauthenticated) {
      return new Observable((subscriber) => {
        renovarToken()
          .then((nuevoToken) => {
            if (!nuevoToken) {
              localStorage.clear();
              window.location.href = '/login';
              subscriber.error(error);
              return;
            }
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: { ...oldHeaders, authorization: `Bearer ${nuevoToken}` },
            });
            forward(operation).subscribe(subscriber);
          })
          .catch(() => {
            localStorage.clear();
            window.location.href = '/login';
            subscriber.error(error);
          });
      });
    }
    error.errors.forEach((e) => console.error(`[GraphQL]: ${e.message}`));
  } else {
    console.error(`[Network]: ${error}`);
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
});

// lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Apuntamos al backend NestJS. 
// Nota: En emuladores de Android físico a veces se usa 10.0.2.2 en lugar de localhost.
// Como estás desarrollando en Web, localhost funcionará perfecto.
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', 
});

// Este middleware interceptará todas las peticiones para inyectar el JWT en el futuro
const authLink = setContext(async (_, { headers }) => {
  // Aquí leeremos el token desde AsyncStorage/SecureStore más adelante
  const token = null; // simulate fetching token
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
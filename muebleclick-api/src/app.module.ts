import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { EstadosModule } from './modules/estados/estados.module';
import { MunicipiosModule } from './modules/municipios/municipios.module';
import { PropietarioModule } from './modules/propietario/propietario.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { MuebleriaModule } from './modules/mueblerias/mueblerias.module';
import { SucursalesModule } from './modules/sucursales/sucursales.module';
import { EmpleadoModule } from './modules/empleado/empleado.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { ProductosModule } from './modules/productos/productos.module';
import { MateriasPrimasModule } from './modules/materias-primas/materias-primas.module';
import { ProveedorProductoModule } from './modules/proveedor-producto/proveedor-producto.module';
import { ProveedorMateriaPrimaModule } from './modules/proveedor-materia-prima/proveedor-materia-prima.module';
import { ProductoMateriaPrimaModule } from './modules/producto-materia-prima/producto-materia-prima.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { InventarioMPModule } from './modules/inventario-mp/inventario-mp.module';
import { MovimientosInventarioModule } from './modules/movimientos-inventario/movimientos-inventario.module';
import { MovimientosInventarioMPModule } from './modules/movimientos-inventario-mp/movimientos-inventario-mp.module';
import { TransferenciasModule } from './modules/transferencias/transferencias.module';
import { ReservasStockModule } from './modules/reservas-stock/reservas-stock.module';
import { OrdenesCompraModule } from './modules/ordenes-compra/ordenes-compra.module';
import { DetalleOrdenCompraModule } from './modules/detalle-orden-compra/detalle-orden-compra.module';
import { ComprasProveedoresModule } from './modules/compras-proveedores/compras-proveedores.module';
import { OrdenesProduccionModule } from './modules/ordenes-produccion/ordenes-produccion.module';
import { DetalleOrdenProduccionModule } from './modules/detalle-orden-produccion/detalle-orden-produccion.module';
import { CuponesModule } from './modules/cupones/cupones.module';
import { MetodoPagoModule } from './modules/metodo-pago/metodo-pago.module';
import { DireccionesEnvioModule } from './modules/direcciones-envio/direcciones-envio.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { DetallePedidoModule } from './modules/detalle-pedido/detalle-pedido.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { DetalleVentaModule } from './modules/detalle-venta/detalle-venta.module';
import { PaqueteriasModule } from './modules/paqueterias/paqueterias.module';
import { EnviosModule } from './modules/envios/envios.module';
import { ComisionesModule } from './modules/comisiones/comisiones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),

    RolesModule,
    UsuariosModule,
    AuthModule,
    EstadosModule,
    MunicipiosModule,
    PropietarioModule,
    ClienteModule,
    MuebleriaModule,
    SucursalesModule,
    EmpleadoModule,
    ProveedoresModule,
    ProductosModule,
    MateriasPrimasModule,
    ProveedorProductoModule,
    ProveedorMateriaPrimaModule,
    ProductoMateriaPrimaModule,
    InventarioModule,
    InventarioMPModule,
    MovimientosInventarioModule,
    MovimientosInventarioMPModule,
    TransferenciasModule,
    ReservasStockModule,
    OrdenesCompraModule,
    DetalleOrdenCompraModule,
    ComprasProveedoresModule,
    OrdenesProduccionModule,
    DetalleOrdenProduccionModule,
    CuponesModule,
    MetodoPagoModule,
    DireccionesEnvioModule,
    PedidosModule,
    DetallePedidoModule,
    VentasModule,
    DetalleVentaModule,
    PaqueteriasModule,
    EnviosModule,
    ComisionesModule,
  ],
})
export class AppModule {}
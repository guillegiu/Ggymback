# 🚀 Deploy en Railway - GGym Backend

## Variables de Entorno Necesarias

Configura estas variables en Railway:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=tu-clave-secreta-jwt-muy-segura
FRONTEND_URL=https://tu-frontend-en-vercel.vercel.app
PORT=5000
```

## Pasos para Deploy

1. **Crear proyecto en Railway:**
   - Ve a https://railway.app
   - Conecta tu repositorio de GitHub
   - Selecciona el directorio `back/`

2. **Configurar Base de Datos:**
   - En Railway, crea un nuevo servicio "PostgreSQL"
   - Copia la `DATABASE_URL` generada
   - Configúrala en las variables de entorno

3. **Configurar Variables:**
   - `JWT_SECRET`: Genera una clave secreta fuerte
   - `FRONTEND_URL`: URL de tu frontend en Vercel
   - `PORT`: 5000 (Railway lo maneja automáticamente)

4. **Deploy:**
   - Railway usará el Dockerfile personalizado
   - Instalará OpenSSL para Prisma
   - Generará el cliente Prisma automáticamente
   - El deploy se completará automáticamente

## Comandos Post-Deploy

Después del deploy, ejecuta estos comandos en Railway:

```bash
# Aplicar migraciones (ya no es necesario generar Prisma)
npx prisma db push --schema=./prisma/schema.prisma

# Poblar base de datos
npm run seed:all
```

## Solución de Problemas

Si encuentras errores de Prisma:
1. Verifica que la `DATABASE_URL` esté configurada correctamente
2. Asegúrate de que el servicio PostgreSQL esté funcionando
3. Revisa los logs de Railway para más detalles

## Verificación

- Health check: `https://tu-backend.railway.app/health`
- API: `https://tu-backend.railway.app/api/health`

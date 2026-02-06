# Acceso de administrador (Humétrica)

## Email para ingresar como administrador

**admin@humetrica.com**

(Usá este email en la pantalla de login una vez creado el usuario en Supabase.)

---

## Cómo dejar listo el primer administrador

1. **Ejecutá la tabla de roles** (si aún no lo hiciste):
   - En Supabase: **SQL Editor** → New query.
   - Pegá y ejecutá todo el contenido de `supabase-user-roles.sql`.

2. **Creá el usuario en Supabase Auth**:
   - En Supabase: **Authentication** → **Users** → **Add user**.
   - Email: **admin@humetrica.com**
   - Password: elegí una contraseña segura (guardala para ingresar en la app).
   - Confirmá con "Create user".

3. **Asignale el rol admin**:
   - En la misma sección Users, abrí el usuario que creaste y **copiá su UUID** (Id).
   - En **SQL Editor** ejecutá (reemplazando `TU_USER_ID` por ese UUID):
   ```sql
   insert into public.user_roles (user_id, role) values ('TU_USER_ID', 'admin');
   ```

4. **Ingresar en la app**:
   - Email: **admin@humetrica.com**
   - Contraseña: la que definiste en el paso 2.

Con eso entrás como administrador y la app te redirige al dashboard.

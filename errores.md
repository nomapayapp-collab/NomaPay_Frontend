Front: 
- Errores en tiempo real 
- crear componente 404
- Error en timestampz (error de starTime)
- Realizar la visualización Desktop
- Hashear los datos personales 
- Error en los Cors (no hay especificacion de rutas o ingresos) 
- Existe un robot... 👻


- mejorar visual de los links y buttons 



Ya resueltos:

Errores en tiempo real → ErrorBoundary global ✅
Crear componente 404 → NotFound.tsx + ruta catch-all + vercel.json (rewrite de Vercel) ✅
Error en los CORS → te pasé el fix para app.ts, pendiente de que Gastón/Gisella lo apliquen (última vez que miré el backend todavía no estaba aplicado)
Google login 500 → migración a @react-oauth/google (recién resuelto en el commit 1 de arriba)
401 en la landing (el que salió ahora en consola) → resuelto con el fix de WalletContext
Pantalla en blanco al cargar (el del "loading") → resuelto con la pantalla de carga en index.html

Todavía sin resolver / sin definir:
7. Error en timestampz / "starTime" → mi hipótesis (sin confirmar todavía) es que es una extensión del navegador, no un bug nuestro — te pedí que probaras en una ventana de Incógnito para descartarlo. ¿Lo probaste?
8. Realizar la visualización Desktop → no arrancamos todavía, no sé si es prioridad ahora mismo.
9. Hashear los datos personales → necesito que me digas qué campo puntual pidió la mentora (¿contraseña? ¿DNI/CUIT si lo guardan? ¿email?) para saber si es algo del front o del back.
10. "Existe un robot... 👻" → sigo sin confirmar si se refiere a protección anti-bot/spam en los formularios (reCAPTCHA o similar) o algo distinto. ¿Podés preguntarle a la mentora qué quiso decir exactamente?



Buenísimo, la B es totalmente viable — de hecho encontré algo importante: el backend ya tiene medio camino andado. El modelo User ya tiene las columnas resetPasswordToken y resetPasswordTokenExpiresAt en el schema real de Postgres (db/schema.sql), solo que nunca se construyó el service/controller/rutas que las use, ni el envío de mail (src/mails/mail.ts existe pero está vacío). Así que no hace falta ninguna migración nueva — directo a construir la lógica.

Te separo todo en dos partes.

Parte backend (para pasarle a Gastón/Gisella)

1) Instalar una dependencia nueva:

npm install nodemailer
npm install -D @types/nodemailer

2) Variables de entorno nuevas (local .env y en Railway):

MAIL_USER=nomapayapp@gmail.com
MAIL_PASSWORD=<contraseña de aplicación de Google, 16 caracteres>
FRONTEND_URL=https://noma-pay-frontend-noma-pay.vercel.app

Para MAIL_PASSWORD no sirve la contraseña normal de Gmail: hay que entrar a la cuenta nomapayapp@gmail.com (¡que resulta que ya existe, esto además resuelve la duda vieja de qué mail iba en la Política de Privacidad! usemos ese) → activarle verificación en dos pasos → Google Account → Seguridad → "Contraseñas de aplicaciones" → generar una para "Correo". Ese código de 16 caracteres es el que va en MAIL_PASSWORD, nunca la contraseña real de la cuenta.


3) src/mails/mail.ts (reemplazar el archivo vacío):

ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await transporter.sendMail({
    from: `"NomaPay" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperá tu contraseña de NomaPay',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0F1330;">Recuperá tu contraseña</h2>
        <p style="color: #333; font-size: 14px; line-height: 1.5;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta NomaPay.
          Si fuiste vos, hacé clic en el siguiente botón. Este link vence en 1 hora.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 24px; border-radius: 999px;
                  background: linear-gradient(135deg, #6633F2, #1FA9EE); color: #fff;
                  text-decoration: none; font-weight: bold;">
          Restablecer contraseña
        </a>
        <p style="color: #888; font-size: 12px;">
          Si no pediste esto, podés ignorar este email — tu contraseña actual sigue siendo válida.
        </p>
      </div>
    `,
  });
}

4) src/services/password-reset.service.ts (archivo nuevo — distinto del password.service.ts que ya tienen, ese es para cambiar contraseña estando logueado):

ts
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/users.model.js';
import { hashToken } from '../utils/jwt.util.js';
import { ValidationError } from '../errors/app-error.js';
import { sendPasswordResetEmail } from '../mails/mail.js';

const RESET_TOKEN_EXPIRES_MIN = Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_MIN ?? 60);

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

  // Si no existe el usuario (o es cuenta de Google sin password propia), no
  // avisamos nada distinto — evita que alguien use esto para "adivinar" qué
  // emails están registrados. Devolvemos éxito igual en el controller.
  if (!user || !user.passwordHash) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000);

  await user.update({
    resetPasswordToken: tokenHash,
    resetPasswordTokenExpiresAt: expiresAt,
  });

  const resetUrl = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashToken(token);

  const user = await User.findOne({ where: { resetPasswordToken: tokenHash } });

  if (!user || !user.resetPasswordTokenExpiresAt || new Date() > user.resetPasswordTokenExpiresAt) {
    throw new ValidationError('El link para restablecer la contraseña es inválido o expiró. Pedí uno nuevo.');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await user.update({
    passwordHash: newPasswordHash,
    passwordChangedAt: new Date(),
    resetPasswordToken: null,
    resetPasswordTokenExpiresAt: null,
  });
}

Nota el patrón: nunca guardamos el token que va por mail tal cual en la base — guardamos su hash (con la misma función hashToken que ya usan para los refresh tokens), y comparamos hasheando lo que llega. Así, si alguien accede a la base, no puede usar esos valores para resetear contraseñas ajenas.

5) src/controllers/password-reset.controller.ts (archivo nuevo):

ts
import type { Request, Response } from 'express';
import { requestPasswordReset, resetPassword } from '../services/password-reset.service.js';
import { AppError } from '../errors/app-error.js';

export async function postForgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Falta el email.' });
    }
    await requestPasswordReset(email);
    // Mismo mensaje exista o no el usuario, a propósito (ver comentario en el service).
    return res.status(200).json({
      message: 'Si el email existe en NomaPay, te enviamos un link para restablecer tu contraseña.',
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'No pudimos procesar la solicitud.' });
  }
}

export async function postResetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Faltan token o newPassword.' });
    }
    await resetPassword(token, newPassword);
    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'No pudimos restablecer la contraseña.' });
  }
}

6) src/routes/auth.routes.ts (agregar dos rutas):

ts
import { Router } from 'express';
import { register } from '../controllers/auth.controller.js';
import { validateRegister } from '../middlewares/validate-register.middleware.js';
import { postForgotPassword, postResetPassword } from '../controllers/password-reset.controller.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/forgot-password', postForgotPassword);
router.post('/reset-password', postResetPassword);

export default router;

Con eso quedan expuestos POST /api/auth/forgot-password (body { email }) y POST /api/auth/reset-password (body { token, newPassword }).

Parte frontend (la armo yo, la pegás vos)

1) Agregar a src/services/authService.ts (al final del archivo):

ts
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/api/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/api/auth/reset-password", { token, newPassword });
  return data;
}

2) src/pages/ForgotPassword.tsx (nuevo):

tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { IconMail, IconBack, IconCheck } from "../assets/icons/Icons";

import { requestPasswordReset } from "../services/authService";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

function validateEmail(value: string) {
  if (!value.trim()) return "El email es obligatorio";
  if (!/\S+@\S+\.\S+/.test(value)) return "Ingresá un email válido";
  return undefined;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    try {
      setLoading(true);
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      console.error("Error al pedir recuperación de contraseña:", err);
      setServerError(extractErrorMessage(err, "No pudimos procesar tu solicitud. Intentá de nuevo."));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-turquoise-500/15 flex items-center justify-center mx-auto mb-5">
            <IconCheck className="w-6 h-6 text-turquoise-500" />
          </div>
          <h1 className="title mb-2">Revisá tu email</h1>
          <p className="subtitle mb-7">
            Si <strong className="text-text-dark-primary">{email}</strong> está registrado en NomaPay, te
            enviamos un link para restablecer tu contraseña. Puede tardar unos minutos en llegar — revisá
            también la carpeta de spam.
          </p>
          <Button variant="outline" to="/login" fullWidth>
            Volver a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/login" className="icon-btn" aria-label="Volver">
            <IconBack className="w-5 h-5" />
          </Link>
          <Logo variant="icono" className="w-7 h-7" />
        </div>

        <h1 className="title mb-1">Recuperar contraseña</h1>
        <p className="subtitle mb-7">
          Ingresá tu email y te mandamos un link para crear una contraseña nueva.
        </p>

        {serverError && (
          <div className="alert-note alert-note--error mb-4">
            <p className="alert-note__description">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            icon={<IconMail className="w-4.5 h-4.5" />}
            placeholder="vos@nomapay.app"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            error={error}
          />

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
            Enviar link
          </Button>
        </form>

        <p className="text-center text-[13px] text-text-dark-tertiary mt-8">
          ¿Te acordaste?{" "}
          <Link to="/login" className="text-violet-300 hover:text-violet-500 font-medium">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

3) src/pages/ResetPassword.tsx (nuevo — reutiliza exactamente las mismas reglas de contraseña y el medidor de fortaleza que ya tenés en Register.tsx):

tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { IconLock, IconCheck } from "../assets/icons/Icons";

import { resetPassword } from "../services/authService";

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

function validatePasswordValue(value: string) {
  if (!value) return "La contraseña es obligatoria";
  if (value.length < 8) return "Mínimo 8 caracteres";
  if (!/[0-9]/.test(value)) return "Sumá al menos un número";
  return undefined;
}
function validateConfirm(value: string, password: string) {
  if (!value) return "Confirmá tu contraseña";
  if (value !== password) return "Las contraseñas no coinciden";
  return undefined;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePasswordValue(value),
      confirmPassword: confirmPassword ? validateConfirm(confirmPassword, value) : prev.confirmPassword,
    }));
  }

  function handleConfirmChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, confirmPassword: validateConfirm(value, password) }));
  }

  function validateForm() {
    const newErrors: ResetErrors = {
      password: validatePasswordValue(password),
      confirmPassword: validateConfirm(confirmPassword, password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    if (!token) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setServerError(
        extractErrorMessage(err, "No pudimos restablecer tu contraseña. Probá pedir un link nuevo.")
      );
    } finally {
      setLoading(false);
    }
  }

  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = password.length >= 12 || /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasNumber, hasSymbol].filter(Boolean).length;
  const strengthLabel = strengthScore <= 1 ? "Débil" : strengthScore === 2 ? "Segura" : "Muy segura";
  const strengthColor = strengthScore <= 1 ? "bg-magenta-500" : "bg-turquoise-500";
  const strengthTextColor = strengthScore <= 1 ? "text-magenta-500" : "text-turquoise-500";

  // Sin token en la URL: link roto o mal copiado, ni mostramos el form.
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
        <div className="w-full max-w-sm text-center">
          <h1 className="title mb-2">Link inválido</h1>
          <p className="subtitle mb-7">
            Este link para restablecer tu contraseña no es válido. Pedí uno nuevo.
          </p>
          <Button variant="primary" to="/recuperar-contrasena" fullWidth>
            Pedir un link nuevo
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-turquoise-500/15 flex items-center justify-center mx-auto mb-5">
            <IconCheck className="w-6 h-6 text-turquoise-500" />
          </div>
          <h1 className="title mb-2">Contraseña actualizada</h1>
          <p className="subtitle mb-7">Ya podés iniciar sesión con tu contraseña nueva.</p>
          <Button variant="primary" to="/login" fullWidth>
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo variant="icono" className="w-7 h-7" />
        </div>

        <h1 className="title mb-1 text-center">Creá una contraseña nueva</h1>
        <p className="subtitle mb-7 text-center">Tiene que ser distinta a la anterior.</p>

        {serverError && (
          <div className="alert-note alert-note--error mb-4">
            <p className="alert-note__description">{serverError}</p>
            {serverError.toLowerCase().includes("expir") && (
              <Link to="/recuperar-contrasena" className="text-[12px] text-violet-300 hover:text-violet-500 underline">
                Pedir un link nuevo
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Contraseña nueva"
            type="password"
            icon={<IconLock className="w-4.5 h-4.5" />}
            placeholder="••••••••••"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
          />

          <div>
            <Input
              label="Confirmar contraseña"
              type="password"
              icon={<IconLock className="w-4.5 h-4.5" />}
              placeholder="••••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleConfirmChange}
              error={errors.confirmPassword}
            />

            {password.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex gap-1.5 flex-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < strengthScore ? strengthColor : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <span className={`text-[12px] font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
                </div>
                <p className="text-[12px] text-text-dark-tertiary">
                  Mínimo 8 caracteres, con un número. Sumá un símbolo para que sea muy segura.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}

4) src/routes/AppRoutes.tsx — agregar imports y dos rutas públicas (no protegidas, obvio, porque el usuario todavía no puede loguearse):

tsx
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

y dentro de <Routes>:

tsx
<Route path="/recuperar-contrasena" element={<ForgotPassword />} />
<Route path="/restablecer-contrasena" element={<ResetPassword />} />

Un par de notas: el mensaje de éxito en ForgotPassword es siempre el mismo exista o no el email — es a propósito, tanto en el back como en el front, así nadie puede usar ese formulario para averiguar qué emails están registrados en NomaPay. Y como límite conocido (no bloqueante para el bootcamp, pero por si Caro pregunta): ese endpoint no tiene rate-limiting, así que en teoría alguien podría spamear pedidos de reset a un mismo email — se podría agregar más adelante con algo como express-rate-limit si da el tiempo.

Cuando Gastón/Gisella tengan su parte armada y vos hayas pegado los 4 cambios del frontend, avisame y corro el tsc para confirmar que compila limpio antes de armar los commits (van a ser dos PRs separados, uno por repo, como siempre).









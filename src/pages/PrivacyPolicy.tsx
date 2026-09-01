import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { IconBack } from "../assets/icons/Icons";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-dark px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button type="button" onClick={() => navigate(-1)} className="icon-btn" aria-label="Volver">
            <IconBack className="w-5 h-5" />
          </button>
          <Logo variant="mono-blanco" className="w-15 h-15" />
        </div>

        <h1 className="title mb-1">Política de Privacidad</h1>
        <p className="subtitle mb-8">Última actualización: septiembre de 2026</p>

        <div className="flex flex-col gap-6 text-[14px] leading-relaxed text-text-dark-secondary">
          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Sobre NomaPay</h2>
            <p>
              NomaPay es un proyecto académico desarrollado como trabajo final del bootcamp de Henry.
              No es un producto financiero real ni una entidad regulada — es una billetera digital de
              demostración, pensada para mostrar cómo funcionaría una app de este tipo. Aun así, nos
              tomamos en serio el cuidado de los datos que nos confiás durante la prueba.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Qué datos recopilamos</h2>
            <p className="mb-2">Cuando creás una cuenta o usás la app, guardamos:</p>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Nombre y apellido</li>
              <li>Dirección de email</li>
              <li>Contraseña (nunca en texto plano — se guarda hasheada)</li>
              <li>País de residencia</li>
              <li>Alias que elijas para recibir pagos</li>
              <li>Saldo y moneda de preferencia dentro de la app</li>
            </ul>
            <p className="mt-2">
              Si iniciás sesión con Google, recibimos tu nombre, email y foto de perfil que ya tenés
              públicos en tu cuenta de Google, a través del inicio de sesión oficial de Google — nunca
              vemos ni guardamos tu contraseña de Google.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Para qué los usamos</h2>
            <p>
              Únicamente para que la app funcione: identificarte al iniciar sesión, mostrar tu saldo y
              tus datos de perfil, y permitir que otras personas te encuentren por tu alias para
              transferirte. No usamos tus datos con fines publicitarios ni los vendemos ni los
              compartimos con terceros.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Dónde se guardan</h2>
            <p>
              Tus datos viven en la base de datos del backend de NomaPay. El token de sesión se guarda
              localmente en tu navegador (localStorage) para mantenerte logueado, y se borra cuando
              cerrás sesión.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Tus derechos</h2>
            <p>
              Podés pedirnos en cualquier momento que actualicemos o eliminemos tu cuenta y tus datos,
              escribiéndonos a{" "}
              <a href="mailto:nomapay@gmail.com" className="text-violet-300 hover:text-violet-500">                nomapayapp@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-text-dark-primary mb-2">Contacto</h2>
            <p>
              Este proyecto fue desarrollado por Agustín Spataro y Candelaria Ferrari (frontend) y
              Gastón Stratta y Gisella Massiero (backend), como parte del programa Full Stack de Henry.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
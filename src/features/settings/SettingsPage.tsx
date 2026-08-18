import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { ProfileSection } from '@/features/settings/ProfileSection';
import { PreferencesSection } from '@/features/settings/PreferencesSection';
import { DataSection } from '@/features/settings/DataSection';
import { useNavigationStore } from '@/stores/navigationStore';

export function SettingsPage() {
  const open = useNavigationStore((s) => s.settingsOpen);
  const close = useNavigationStore((s) => s.closeSettings);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-surface-0"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="h-full overflow-y-auto no-scrollbar pb-[calc(env(safe-area-inset-bottom,0px)+40px)]"
          >
            <header className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+18px)]">
              <h1 className="text-[22px] font-bold text-text-primary">Ajustes</h1>
              <button
                onClick={close}
                aria-label="Cerrar ajustes"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-secondary"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </header>

            <div className="mt-6 flex flex-col gap-8 px-5">
              <SettingsSection title="Perfil">
                <ProfileSection />
              </SettingsSection>

              <SettingsSection title="Preferencias">
                <PreferencesSection />
              </SettingsSection>

              <SettingsSection title="Datos">
                <DataSection />
              </SettingsSection>

              <SettingsSection title="Privacidad">
                <div className="flex items-start gap-3 rounded-3xl border border-border-subtle bg-surface-1 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <p className="text-[13px] leading-relaxed text-text-secondary">
                    YOU guarda toda tu información únicamente en este dispositivo, usando el almacenamiento local del
                    navegador (IndexedDB). No se envía a ningún servidor ni se comparte con nadie. Si borras los
                    datos del navegador o desinstalas la app, esta información se pierde — usa "Exportar datos"
                    para guardar una copia.
                  </p>
                </div>
              </SettingsSection>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">{title}</h2>
      {children}
    </section>
  );
}

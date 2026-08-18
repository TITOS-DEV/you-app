import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import * as storageService from '@/services/storageService';
import { useToastStore } from '@/stores/toastStore';

export function DataSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<storageService.BackupPayload | null>(null);
  const showToast = useToastStore((s) => s.show);

  async function handleExport() {
    await storageService.exportBackup();
    showToast('Copia de seguridad descargada', 'success');
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const payload = storageService.parseBackup(raw);
      setPendingImport(payload);
      setConfirmImportOpen(true);
    } catch {
      showToast('El archivo no es una copia de seguridad válida', 'warning');
    }
  }

  async function confirmImport() {
    if (!pendingImport) return;
    await storageService.importBackup(pendingImport);
    setPendingImport(null);
    showToast('Datos importados', 'success');
  }

  async function confirmClear() {
    await storageService.clearAllData();
    showToast('Todos los datos fueron eliminados', 'success');
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" onClick={handleExport} className="w-full justify-start">
        <Download className="h-4 w-4" /> Exportar datos
      </Button>
      <Button variant="secondary" onClick={handleImportClick} className="w-full justify-start">
        <Upload className="h-4 w-4" /> Importar datos
      </Button>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />
      <Button variant="danger" onClick={() => setConfirmClearOpen(true)} className="w-full justify-start">
        <Trash2 className="h-4 w-4" /> Borrar todos los datos
      </Button>

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="¿Borrar todos los datos?"
        description="Esta acción elimina hábitos, registros de agua, peso, ejercicio, rachas y ajustes de este dispositivo. No se puede deshacer."
        confirmLabel="Borrar todo"
        destructive
        onConfirm={confirmClear}
      />

      <ConfirmDialog
        open={confirmImportOpen}
        onOpenChange={setConfirmImportOpen}
        title="¿Importar esta copia de seguridad?"
        description="Se reemplazarán todos los datos actuales por los del archivo seleccionado."
        confirmLabel="Importar"
        destructive
        onConfirm={confirmImport}
      />
    </div>
  );
}

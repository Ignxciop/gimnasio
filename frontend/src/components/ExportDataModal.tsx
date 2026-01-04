import { useState } from "react";
import { X, Download, FileSpreadsheet, FileJson } from "lucide-react";
import { Button } from "./ui/Button";
import "./exportDataModal.css";

interface ExportDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: "csv" | "json") => Promise<void>;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
    isOpen,
    onClose,
    onExport,
}) => {
    const [selectedFormat, setSelectedFormat] = useState<"csv" | "json">("csv");
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await onExport(selectedFormat);
            onClose();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content export-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Exportar mis datos</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={24} />
                    </button>
                </div>

                <div className="export-modal-body">
                    <p className="export-description">
                        Elige el formato en el que deseas descargar tus datos
                    </p>

                    <div className="format-options">
                        <div
                            className={`format-option ${
                                selectedFormat === "csv" ? "selected" : ""
                            }`}
                            onClick={() => setSelectedFormat("csv")}
                        >
                            <div className="format-option-radio">
                                <div className="radio-outer">
                                    {selectedFormat === "csv" && (
                                        <div className="radio-inner" />
                                    )}
                                </div>
                            </div>
                            <div className="format-option-content">
                                <div className="format-option-header">
                                    <FileSpreadsheet size={24} />
                                    <span className="format-option-title">
                                        CSV
                                    </span>
                                    <span className="format-option-badge">
                                        Recomendado
                                    </span>
                                </div>
                                <p className="format-option-description">
                                    Ideal para abrir en Excel y analizar tu
                                    progreso
                                </p>
                            </div>
                        </div>

                        <div
                            className={`format-option ${
                                selectedFormat === "json" ? "selected" : ""
                            }`}
                            onClick={() => setSelectedFormat("json")}
                        >
                            <div className="format-option-radio">
                                <div className="radio-outer">
                                    {selectedFormat === "json" && (
                                        <div className="radio-inner" />
                                    )}
                                </div>
                            </div>
                            <div className="format-option-content">
                                <div className="format-option-header">
                                    <FileJson size={24} />
                                    <span className="format-option-title">
                                        JSON
                                    </span>
                                </div>
                                <p className="format-option-description">
                                    Respaldo completo de todos tus datos
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            disabled={isExporting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleExport}
                            variant="primary"
                            isLoading={isExporting}
                        >
                            <Download size={18} />
                            Descargar datos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

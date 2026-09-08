import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Drug } from '../../types';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrug: (drug: Drug) => void;
  availableDrugs: Drug[];
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectDrug,
  availableDrugs,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    patientName: string;
    doctorName: string;
    npi: string;
    drugMatch: Drug;
    dosage: string;
    refillsRemaining: number;
    rxNumber: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulatedUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const metformin = availableDrugs.find((d) => d.id === 'metformin-500-er') || availableDrugs[0];
      setExtractedData({
        patientName: 'Marcus Vance (DOB: 11/14/1984)',
        doctorName: 'Dr. Sarah Smith, MD (Endocrinology)',
        npi: '1982739102',
        drugMatch: metformin,
        dosage: 'Take 1 tablet (500mg) orally once daily with evening meal',
        refillsRemaining: 3,
        rxNumber: 'RX-99201',
      });
    }, 1400);
  };

  const handleApplyMatch = () => {
    if (extractedData) {
      onSelectDrug(extractedData.drugMatch);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Instant Prescription Price Match</h3>
            <p className="text-xs text-slate-500">AI OCR extraction with FDA Orange Book generic normalization</p>
          </div>
        </div>

        {!extractedData ? (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleSimulatedUpload();
              }}
              onClick={handleSimulatedUpload}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              {isProcessing ? (
                <div className="py-6 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-slate-800">Analyzing Prescription Scan...</p>
                  <p className="text-xs text-slate-500 mt-1">Cross-referencing RxNorm, NDC, and 18 local pharmacy feeds</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to upload or drag and drop prescription
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports JPG, PNG, PDF or camera phone snapshot
                  </p>
                  <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    Try Sample: Dr. Smith Rx (Metformin 500mg)
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                256-bit HIPAA compliant ingestion. Prescriptions are verified against active state medical board licenses before dispensing.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Prescription Verified & Generic Matched!
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  FDA AB1-rated equivalence confirmed. We found an 78% price reduction.
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs bg-white">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{extractedData.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Prescribing Physician:</span>
                <span className="font-semibold text-slate-900">{extractedData.doctorName} (NPI: {extractedData.npi})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Prescribed Brand / Strength:</span>
                <span className="font-semibold text-slate-900">Glucophage XR 500mg</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Matched AB Generic:</span>
                <span className="font-bold text-blue-600">{extractedData.drugMatch.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Dosage Instructions:</span>
                <span className="text-slate-700 text-right max-w-[260px]">{extractedData.dosage}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Retail Brand Price:</span>
                <span className="line-through text-slate-400 font-medium">$18.90</span>
              </div>
              <div className="flex justify-between text-sm pt-0.5">
                <span className="font-bold text-slate-800">Best Network Generic Rate:</span>
                <span className="font-black text-emerald-600">${extractedData.drugMatch.lowestPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setExtractedData(null)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Scan Another
              </button>
              <button
                onClick={handleApplyMatch}
                className="flex-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center space-x-1.5"
              >
                <span>Compare All 18 Sellers for this Rx</span>
                <FileCheck2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

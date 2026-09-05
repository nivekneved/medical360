import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Sliders,
  Ruler,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import './MedicalImagingViewer.css';

export interface MedicalScanSlice {
  id: string;
  title: string;
  modality: 'MRI' | 'CT' | 'X-RAY' | 'ULTRASOUND' | 'REPORT';
  imageUrl: string;
  sliceInfo: string;
  date: string;
  bodyPart: string;
}

interface MedicalImagingViewerProps {
  patientName: string;
  inquiryId: string;
  specialtyName?: string;
  customScans?: MedicalScanSlice[];
  onClose?: () => void;
}

const DEFAULT_SCANS: MedicalScanSlice[] = [
  {
    id: 'scan-1',
    title: 'Axial T2 Brain MRI with Contrast',
    modality: 'MRI',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
    sliceInfo: 'Slice 16/32 • 2.5mm',
    date: '2026-08-28',
    bodyPart: 'Cranial / Neurological',
  },
  {
    id: 'scan-2',
    title: 'Coronal Chest CT Angiogram',
    modality: 'CT',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    sliceInfo: 'Slice 08/24 • 1.0mm High-Res',
    date: '2026-08-29',
    bodyPart: 'Thoracic / Cardiology',
  },
  {
    id: 'scan-3',
    title: 'Digital Lumbar Spine AP/Lateral Radiography',
    modality: 'X-RAY',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    sliceInfo: 'Series 01 • Standing Weight-Bearing',
    date: '2026-08-30',
    bodyPart: 'Orthopedics / Spine',
  },
  {
    id: 'scan-4',
    title: 'Cardiac Echocardiogram Doppler Flow',
    modality: 'ULTRASOUND',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    sliceInfo: 'Color Doppler • 4-Chamber View',
    date: '2026-09-01',
    bodyPart: 'Cardiovascular',
  },
];

export const MedicalImagingViewer: React.FC<MedicalImagingViewerProps> = ({
  patientName,
  inquiryId,
  specialtyName = 'Specialized Medicine',
  customScans,
  onClose,
}) => {
  const scans = customScans && customScans.length > 0 ? customScans : DEFAULT_SCANS;
  const [selectedScanId, setSelectedScanId] = useState(scans[0].id);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filterMode, setFilterMode] = useState<'filter-soft-tissue' | 'filter-bone' | 'filter-lung' | 'filter-invert' | 'filter-thermal'>('filter-soft-tissue');
  const [caliperActive, setCaliperActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Position / pan
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const currentScan = scans.find(s => s.id === selectedScanId) || scans[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (caliperActive) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setFilterMode('filter-soft-tissue');
    setCaliperActive(false);
  };

  return (
    <div className={`medical-viewer ${isFullscreen ? 'medical-viewer--fullscreen' : ''}`}>
      {/* ── Viewer Header ── */}
      <div className="medical-viewer__header">
        <div className="medical-viewer__patient-meta">
          <span className="medical-viewer__modality-tag">
            {currentScan.modality}
          </span>
          <div>
            <h3 className="medical-viewer__title">
              {currentScan.title}
            </h3>
            <span className="medical-viewer__sub">
              Patient: <strong>{patientName}</strong> • Ref: <code>{inquiryId}</code> • {specialtyName}
            </span>
          </div>
        </div>

        <div className="medical-viewer__header-actions">
          {onClose && (
            <button type="button" className="medical-viewer__btn" onClick={onClose}>
              Close Viewer
            </button>
          )}
        </div>
      </div>

      {/* ── Diagnostic Toolbar ── */}
      <div className="medical-viewer__toolbar">
        <div className="medical-viewer__tool-group">
          <button
            type="button"
            className="medical-viewer__btn"
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 3.5))}
            title="Zoom In"
          >
            <ZoomIn size={14} /> Zoom +
          </button>
          <button
            type="button"
            className="medical-viewer__btn"
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
            title="Zoom Out"
          >
            <ZoomOut size={14} /> Zoom -
          </button>
          <button
            type="button"
            className="medical-viewer__btn"
            onClick={() => setRotation(prev => (prev + 90) % 360)}
            title="Rotate 90° Clockwise"
          >
            <RotateCw size={14} /> Rotate
          </button>
          <button
            type="button"
            className="medical-viewer__btn"
            onClick={handleReset}
            title="Reset Viewport & Filters"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        <div className="medical-viewer__tool-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sliders size={14} color="#94a3b8" />
            <select
              className="medical-viewer__filter-select"
              value={filterMode}
              onChange={e => setFilterMode(e.target.value as any)}
            >
              <option value="filter-soft-tissue">Soft Tissue Grayscale (Normal)</option>
              <option value="filter-bone">Bone Window (High Contrast)</option>
              <option value="filter-lung">Lung / Thorax Dynamic Window</option>
              <option value="filter-invert">Radiology Negative / Invert</option>
              <option value="filter-thermal">Doppler False-Color Thermal</option>
            </select>
          </div>

          <button
            type="button"
            className={`medical-viewer__btn ${caliperActive ? 'medical-viewer__btn--active' : ''}`}
            onClick={() => setCaliperActive(!caliperActive)}
            title="Toggle Distance Caliper"
          >
            <Ruler size={14} /> {caliperActive ? 'Caliper (Active: 24.8mm)' : 'Caliper'}
          </button>

          <a
            href={currentScan.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`${inquiryId}_${currentScan.modality}.jpg`}
            className="medical-viewer__btn"
            title="Download Scan Image"
          >
            <Download size={14} /> Export
          </a>
        </div>
      </div>

      {/* ── Viewport Stage ── */}
      <div
        className="medical-viewer__stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* HUD Top Left */}
        <div className="medical-viewer__hud-tl">
          <div>PATIENT: {patientName.toUpperCase()}</div>
          <div>ID: {inquiryId}</div>
          <div>REGION: {currentScan.bodyPart.toUpperCase()}</div>
        </div>

        {/* HUD Top Right */}
        <div className="medical-viewer__hud-tr">
          <div>MODALITY: {currentScan.modality}</div>
          <div>{currentScan.sliceInfo}</div>
          <div>ACQUIRED: {currentScan.date}</div>
        </div>

        {/* HUD Bottom Left */}
        <div className="medical-viewer__hud-bl">
          <div>ZOOM: {(zoom * 100).toFixed(0)}%</div>
          <div>ROTATION: {rotation}°</div>
          <div>WINDOW: {filterMode.replace('filter-', '').toUpperCase()}</div>
        </div>

        {/* HUD Bottom Right */}
        <div className="medical-viewer__hud-br">
          <div>MED360 CLINICAL PACS</div>
          <div>DIAGNOSTIC PREVIEW</div>
        </div>

        {/* Scan Image Container */}
        <div
          className="medical-viewer__image-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={currentScan.imageUrl}
            alt={currentScan.title}
            className={`medical-viewer__img ${filterMode}`}
            draggable={false}
          />

          {/* Caliper Simulation Marker */}
          {caliperActive && (
            <div
              className="medical-viewer__caliper-line"
              style={{
                width: 140,
                top: '48%',
                left: '32%',
                transform: 'rotate(-15deg)',
              }}
            >
              <div className="medical-viewer__caliper-label">
                24.8 mm ± 0.2
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Thumbnail Series Carousel ── */}
      <div className="medical-viewer__carousel">
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingRight: '0.5rem', whiteSpace: 'nowrap' }}>
          Series ({scans.length}):
        </div>
        {scans.map(s => {
          const isActive = s.id === selectedScanId;
          return (
            <button
              key={s.id}
              type="button"
              className={`medical-viewer__thumb ${isActive ? 'medical-viewer__thumb--active' : ''}`}
              onClick={() => {
                setSelectedScanId(s.id);
                setPan({ x: 0, y: 0 });
              }}
              title={`${s.modality}: ${s.title}`}
            >
              <img src={s.imageUrl} alt={s.title} />
              <span className="medical-viewer__thumb-label">{s.modality}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

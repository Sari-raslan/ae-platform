import AIDashboard from "./components/ai/AIDashboard";
import MidiDashboard from "./components/MidiDashboard";
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ChevronDown, ChevronRight, Clipboard, Copy, Download, FileAudio, FolderOpen, HardDriveUpload, Keyboard, RefreshCw, Search, Trash2, Usb } from 'lucide-react';
import { selectExplorerState } from './explorerState.js';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const SORT_OPTIONS = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'size', label: 'Size' },
  { key: 'updatedAt', label: 'Updated' }
];
const COLLAPSIBLE_ROOTS = ['Korg', 'Yamaha', 'Roland', 'Ketron', 'uploads'];

function App() {
  const [status, setStatus] = useState(null);
  const [library, setLibrary] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [expanded, setExpanded] = useState(() => Object.fromEntries(COLLAPSIBLE_ROOTS.map((root) => [root, true])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function loadLibrary() {
    setError('');
    const [statusRes, libraryRes] = await Promise.all([
      fetch(`${API}/api/status`),
      fetch(`${API}/api/library`)
    ]);
    setStatus(await statusRes.json());
    setLibrary(await libraryRes.json());
  }

  async function analyze(id) {
    setBusy(true);
    setError('');
    setSelectedId(id);
    try {
      const response = await fetch(`${API}/api/library/${encodeURIComponent(id)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Analysis failed');
      setSelected(body);
    } catch (err) {
      setSelected(null);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file) {
    if (!file) return;
    setBusy(true);
    setError('');
    const data = new FormData();
    data.append('file', file);
    try {
      const response = await fetch(`${API}/api/upload`, { method: 'POST', body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Upload failed');
      setSelectedId(body.id || null);
      setSelected(body);
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(id) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/library/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      if (selectedId === id) {
        setSelectedId(null);
        setSelected(null);
      }
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyText(value, label) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setError('');
    } catch {
      setError(`${label} copy is not available in this browser.`);
    }
  }

  function toggleSort(key) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function toggleExpanded(id) {
    setExpanded((current) => ({ ...current, [id]: current[id] === false }));
  }

  function setAllExpanded(value) {
    setExpanded((current) => {
      const next = { ...current };
      explorerState.treeRoots.forEach((root) => {
        next[root.id] = value;
      });
      return next;
    });
  }

  useEffect(() => {
    loadLibrary().catch((err) => setError(`Backend unavailable: ${err.message}`));
  }, []);

  const debouncedQuery = useDebouncedValue(query, 180);
  const explorerState = useMemo(
    () => selectExplorerState(library, {
      selectedId,
      query: debouncedQuery,
      category,
      sort,
      expanded,
      selectedAnalysis: selected
    }),
    [library, selectedId, debouncedQuery, category, sort, expanded, selected]
  );
  const { rows: visibleRows, stats, categoryCounts } = explorerState;
  const initialLoading = !status && !library.length && !error;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brandLockup" aria-label="Keyboard Manager">
          <img src="/logo-icon.svg" alt="" className="brandMark" />
          <div>
            <p className="brandName">Keyboard Manager</p>
            <p className="brandMeta">Arranger workstation library / ظ…ط¯ظٹط± ظ…ظ„ظپط§طھ ط§ظ„ط£ظˆط±ط؛</p>
          </div>
        </div>
        <div className="topbarCopy">
          <p className="eyebrow">MIDI, SysEx, style and SET inspection</p>
          <h1>Professional arranger file control</h1>
        </div>
        <button className="iconButton" onClick={loadLibrary} title="Refresh library">
          <RefreshCw size={18} />
        </button>
      </header>

      {initialLoading && <SplashBrand />}

      {error && <div className="error">{error}</div>}

      <section className="dashboard">
        <Metric icon={<FolderOpen />} label="Library" value={stats.visibleCount} hint={`${stats.totalCount} total files and SET folders`} />
        <Metric icon={<FileAudio />} label="Storage" value={formatBytes(stats.totalBytes)} hint="safe local samples" />
        <Metric icon={<Activity />} label="Backend" value={status?.ok ? 'Online' : 'Offline'} hint="Express API" />
        <Metric icon={<Keyboard />} label="Parsers" value={status?.supportedExtensions?.length || 0} hint="MIDI, SysEx, arranger" />
      </section>

      <section className="workspace">
        <div className="panel uploadPanel">
          <div className="panelHeader">
            <HardDriveUpload size={19} />
            <h2>Upload / ط±ظپط¹ ظ…ظ„ظپ</h2>
          </div>
          <label className="dropzone">
            <input type="file" onChange={(event) => uploadFile(event.target.files?.[0])} />
            <span>Choose MIDI, SysEx, style, set, backup, package, or unknown binary file</span>
          </label>

          <div className="panelHeader compact">
            <FolderOpen size={19} />
            <h2>Library / ط§ظ„ظ…ظƒطھط¨ط©</h2>
          </div>
          <label className="searchField">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, path, extension, category, metadata"
            />
          </label>
          <div className="categoryChips" aria-label="Explorer categories">
            {categoryCounts.map((chip) => (
              <button
                key={chip.key}
                className="chip"
                type="button"
                aria-pressed={category === chip.key}
                onClick={() => setCategory(chip.key)}
              >
                <span>{chip.label}</span>
                <strong>{chip.count}</strong>
              </button>
            ))}
          </div>
          <div className="explorerToolbar" aria-label="Explorer controls">
            <div className="sortButtons">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  className="sortButton"
                  type="button"
                  aria-pressed={sort.key === option.key}
                  onClick={() => toggleSort(option.key)}
                >
                  {option.label}{sort.key === option.key ? ` ${sort.direction}` : ''}
                </button>
              ))}
            </div>
            <div className="treeButtons">
              <button type="button" className="iconButton small" title="Expand tree" onClick={() => setAllExpanded(true)}>
                <ChevronDown size={16} />
              </button>
              <button type="button" className="iconButton small" title="Collapse tree" onClick={() => setAllExpanded(false)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="libraryList">
            {visibleRows.map((row) => (
              <div className="libraryItem" key={row.id} style={{ '--depth': row.depth }}>
                <button
                  type="button"
                  className="treeToggle"
                  title={row.canExpand ? (row.isExpanded ? 'Collapse' : 'Expand') : 'Tree item'}
                  disabled={!row.canExpand}
                  onClick={() => toggleExpanded(row.treeRoot)}
                >
                  {row.canExpand ? (row.isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />) : null}
                </button>
                <button onClick={() => analyze(row.id)} className="itemButton" aria-current={row.isSelected ? 'true' : undefined}>
                  <span>{row.name}</span>
                  <small>{row.categoryLabel} - {row.kindLabel}</small>
                </button>
                <button className="iconButton small" type="button" onClick={() => copyText(row.pathText, 'Path')} title="Copy path">
                  <Copy size={16} />
                </button>
                <button className="iconButton small" type="button" onClick={() => copyText(row.metadataText, 'Metadata')} title="Copy metadata">
                  <Clipboard size={16} />
                </button>
                <a className="iconButton small" href={`${API}/api/export/${encodeURIComponent(row.id)}`} title="Export JSON">
                  <Download size={16} />
                </a>
                <button className="iconButton small danger" onClick={() => deleteItem(row.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {!visibleRows.length && <p className="muted">{stats.totalCount ? 'No library items match this search.' : 'No library items yet.'}</p>}
          </div>
        </div>

        <AnalysisViewer analysis={selected} busy={busy} />
      </section>

      <MidiMonitor />
    <MidiDashboard />
<AIDashboard />
</main>
  );
}

function SplashBrand() {
  return (
    <section className="splash" aria-label="Loading Keyboard Manager">
      <img src="/logo-horizontal.svg" alt="Keyboard Manager" />
      <div className="splashLine" />
    </section>
  );
}

function Metric({ icon, label, value, hint }) {
  return (
    <div className="metric">
      <div className="metricIcon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

function AnalysisViewer({ analysis, busy }) {
  if (busy) return <section className="panel analysis"><p className="muted">Analyzing...</p></section>;
  if (!analysis) return <section className="panel analysis"><p className="muted">Select a library item to inspect metadata, MIDI counts, SysEx blocks, strings, and safe hex previews.</p></section>;
  return (
    <section className="panel analysis">
      <div className="panelHeader">
        <FileAudio size={19} />
        <h2>Analysis / ط§ظ„طھط­ظ„ظٹظ„</h2>
      </div>
      <div className="analysisTitle">
        <div>
          <h3>{analysis.name}</h3>
          <p>{analysis.parser || analysis.kind} آ· {analysis.possibleBrand || 'unknown brand'} آ· {formatBytes(analysis.size)}</p>
        </div>
        {analysis.deepParserNeeded && <span className="badge">Deep parser needed</span>}
      </div>
      {analysis.midi && <KeyValue title="MIDI" data={analysis.midi} />}
      {analysis.sysex && <KeyValue title="SysEx" data={analysis.sysex} />}
      {analysis.metadata && <KeyValue title="Binary metadata" data={analysis.metadata} />}
      {analysis.extensionCounts && <KeyValue title="Extensions" data={analysis.extensionCounts} />}
      {analysis.hexPreview && <CodeBlock title="Hex preview" value={analysis.hexPreview} />}
      {!!analysis.strings?.length && <CodeBlock title="Extracted strings" value={analysis.strings.join('\n')} />}
      {!!analysis.children?.length && (
        <div>
          <h4>Contained files</h4>
          <div className="childGrid">
            {analysis.children.map((child) => (
              <div className="child" key={child.id}>
                <strong>{child.id}</strong>
                <span>{child.extension || '[none]'} آ· {formatBytes(child.size)} آ· {child.parser}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function KeyValue({ title, data }) {
  return (
    <div>
      <h4>{title}</h4>
      <dl className="kv">
        {Object.entries(data).filter(([, value]) => typeof value !== 'object').map(([key, value]) => (
          <React.Fragment key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

function CodeBlock({ title, value }) {
  return (
    <div>
      <h4>{title}</h4>
      <pre>{value}</pre>
    </div>
  );
}

function MidiMonitor() {
  const [supported, setSupported] = useState(Boolean(navigator.requestMIDIAccess));
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [events, setEvents] = useState([]);

  async function connect() {
    if (!navigator.requestMIDIAccess) {
      setSupported(false);
      return;
    }
    const access = await navigator.requestMIDIAccess({ sysex: false });
    setInputs([...access.inputs.values()]);
    setOutputs([...access.outputs.values()]);
    access.inputs.forEach((input) => {
      input.onmidimessage = (message) => {
        const [status, data1, data2] = message.data;
        const type = status >= 0x90 && status < 0xa0 ? 'note' : status >= 0xb0 && status < 0xc0 ? 'controller' : status >= 0xc0 && status < 0xd0 ? 'program' : 'midi';
        setEvents((current) => [{ time: new Date().toLocaleTimeString(), type, bytes: [...message.data], data1, data2 }, ...current].slice(0, 40));
      };
    });
  }

  return (
    <section className="panel midi">
      <div className="panelHeader">
        <Usb size={19} />
        <h2>USB MIDI monitor / ظ…ط±ط§ظ‚ط¨ط© MIDI</h2>
        <button onClick={connect} className="actionButton">Connect</button>
      </div>
      {!supported && <p className="muted">Web MIDI is not available in this browser.</p>}
      <div className="midiDevices">
        <span>Inputs: {inputs.map((item) => item.name).join(', ') || 'none'}</span>
        <span>Outputs: {outputs.map((item) => item.name).join(', ') || 'none'}</span>
      </div>
      <div className="eventList">
        {events.map((event, index) => (
          <div className="event" key={`${event.time}-${index}`}>
            <strong>{event.type}</strong>
            <span>{event.time}</span>
            <code>{event.bytes.map((byte) => byte.toString(16).padStart(2, '0')).join(' ')}</code>
          </div>
        ))}
        {!events.length && <p className="muted">No live MIDI messages yet.</p>}
      </div>
    </section>
  );
}

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

createRoot(document.getElementById('root')).render(<App />);



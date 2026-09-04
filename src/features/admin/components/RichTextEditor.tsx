import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Eye,
  Type,
  Palette,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  CornerDownLeft,
} from 'lucide-react';
import { sanitizeHtml } from '../../../core/services/security.service';
import './RichTextEditor.css';

export interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  id?: string;
}

const TEMPLATE_COLORS = [
  { name: 'Primary Emerald', hex: '#065f46', bg: '#065f46', text: '#ffffff' },
  { name: 'Bright Mint', hex: '#10b981', bg: '#10b981', text: '#ffffff' },
  { name: 'Ocean Blue', hex: '#0284c7', bg: '#0284c7', text: '#ffffff' },
  { name: 'Royal Indigo', hex: '#4f46e5', bg: '#4f46e5', text: '#ffffff' },
  { name: 'Sunset Amber', hex: '#d97706', bg: '#d97706', text: '#ffffff' },
  { name: 'Crimson Rose', hex: '#e11d48', bg: '#e11d48', text: '#ffffff' },
  { name: 'Dark Slate', hex: '#0f172a', bg: '#0f172a', text: '#ffffff' },
  { name: 'Muted Gray', hex: '#64748b', bg: '#64748b', text: '#ffffff' },
];

const QUICK_SNIPPETS = [
  {
    label: 'Green Callout Box',
    html: '<div style="background: rgba(6, 95, 70, 0.08); border-left: 4px solid #065f46; padding: 12px 16px; border-radius: 6px; margin: 12px 0;"><strong>Important Notice:</strong> Your text goes here.</div>',
  },
  {
    label: 'Amber Alert Box',
    html: '<div style="background: rgba(217, 119, 6, 0.08); border-left: 4px solid #d97706; padding: 12px 16px; border-radius: 6px; margin: 12px 0;"><strong>Note:</strong> Please verify details before proceeding.</div>',
  },
  {
    label: 'Verified Badge Pill',
    html: '<span style="background: #10b981; color: #ffffff; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; display: inline-block;">✓ Verified by Medical 360</span>',
  },
  {
    label: '2-Column Feature Grid',
    html: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;"><strong>Feature 1</strong><p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Feature description here.</p></div><div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;"><strong>Feature 2</strong><p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Feature description here.</p></div></div>',
  },
  {
    label: 'Action Button Link',
    html: '<a href="/describe-need" style="display: inline-block; background: #065f46; color: #ffffff; padding: 8px 18px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 13px;">Request Free Medical Opinion →</a>',
  },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content, format text, or paste HTML code here…',
  minHeight = 140,
  label,
  id,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize visual editor when tab switches or value updates externally
  useEffect(() => {
    if (visualEditorRef.current && activeTab === 'visual') {
      if (visualEditorRef.current.innerHTML !== value) {
        visualEditorRef.current.innerHTML = value || '';
      }
    }
  }, [value, activeTab]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      onChange(html);
    }
  };

  const executeCmd = (command: string, value: string = '') => {
    if (activeTab !== 'visual') {
      setActiveTab('visual');
      setTimeout(() => {
        if (visualEditorRef.current) {
          visualEditorRef.current.focus();
          document.execCommand(command, false, value);
          handleVisualInput();
        }
      }, 50);
      return;
    }

    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand(command, false, value);
      handleVisualInput();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (!size) return;

    if (size.startsWith('h')) {
      executeCmd('formatBlock', `<${size}>`);
    } else if (size === 'lead') {
      insertHtmlAroundSelection('<p style="font-size: 1.15rem; line-height: 1.6; color: var(--color-text);">', '</p>');
    } else if (size === 'small') {
      insertHtmlAroundSelection('<span style="font-size: 0.8rem; color: var(--color-text-secondary);">', '</span>');
    } else {
      executeCmd('formatBlock', '<p>');
    }
    e.target.value = '';
  };

  const handleApplyColor = (colorHex: string) => {
    executeCmd('foreColor', colorHex);
    setShowColorPicker(false);
  };

  const handleApplyHighlight = (bgHex: string, textHex: string) => {
    insertHtmlAroundSelection(
      `<span style="background-color: ${bgHex}; color: ${textHex}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">`,
      '</span>'
    );
    setShowColorPicker(false);
  };

  const insertHtmlAroundSelection = (before: string, after: string) => {
    if (activeTab === 'code' && textareaRef.current) {
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.substring(start, end) || 'text';
      const replacement = before + selected + after;
      const newVal = ta.value.substring(0, start) + replacement + ta.value.substring(end);
      onChange(newVal);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 50);
      return;
    }

    // Visual Mode
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      executeCmd('insertHTML', `${before}text${after}`);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'text';
    const htmlSnippet = `${before}${selectedText}${after}`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlSnippet;
    const frag = document.createDocumentFragment();
    let node: Node | null;
    while ((node = tempDiv.firstChild)) {
      frag.appendChild(node);
    }

    range.deleteContents();
    range.insertNode(frag);
    handleVisualInput();
  };

  const handleInsertLink = () => {
    const url = prompt('Enter web URL or path (e.g., https://... or /hospitals):', 'https://');
    if (url) {
      executeCmd('createLink', url);
    }
  };

  const handleInsertSnippet = (html: string) => {
    if (activeTab === 'code') {
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const newVal = ta.value.substring(0, start) + '\n' + html + '\n' + ta.value.substring(start);
        onChange(newVal);
      } else {
        onChange(value + '\n' + html);
      }
    } else {
      executeCmd('insertHTML', html);
    }
    setShowSnippets(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        executeCmd('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        executeCmd('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        executeCmd('underline');
      }
    }
  };

  return (
    <div className="rich-editor" id={id}>
      {/* Label and Mode Switcher Top Bar */}
      <div className="rich-editor__header">
        {label && <span className="rich-editor__label">{label}</span>}
        
        <div className="rich-editor__tabs">
          <button
            type="button"
            className={`rich-editor__tab ${activeTab === 'visual' ? 'rich-editor__tab--active' : ''}`}
            onClick={() => setActiveTab('visual')}
            title="Visual WYSIWYG Editor"
          >
            <Type size={13} /> Visual Editor
          </button>
          <button
            type="button"
            className={`rich-editor__tab ${activeTab === 'code' ? 'rich-editor__tab--active' : ''}`}
            onClick={() => setActiveTab('code')}
            title="Raw HTML Code Area"
          >
            <Code size={13} /> HTML Code Area
          </button>
          <button
            type="button"
            className={`rich-editor__tab ${activeTab === 'preview' ? 'rich-editor__tab--active' : ''}`}
            onClick={() => setActiveTab('preview')}
            title="Live Formatted Preview"
          >
            <Eye size={13} /> Live Preview
          </button>
        </div>
      </div>

      {/* Formatting Action Toolbar */}
      <div className="rich-editor__toolbar">
        {/* Text Size / Heading Selector */}
        <div className="rich-editor__group">
          <select
            className="rich-editor__select"
            onChange={handleFontSizeChange}
            defaultValue=""
            title="Text Size & Hierarchy"
          >
            <option value="" disabled>Size / Heading</option>
            <option value="p">Regular Text (14px)</option>
            <option value="small">Small Note (12px)</option>
            <option value="lead">Lead / Subheading (18px)</option>
            <option value="h3">Heading 3 (20px)</option>
            <option value="h2">Heading 2 (24px)</option>
            <option value="h1">Big Title (28px)</option>
          </select>
        </div>

        <div className="rich-editor__divider" />

        {/* Basic Styles */}
        <div className="rich-editor__group">
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('strikeThrough')}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
        </div>

        <div className="rich-editor__divider" />

        {/* Color Palette Popover Trigger */}
        <div className="rich-editor__group" style={{ position: 'relative' }}>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Template Colors & Badges"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Palette size={14} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Colors</span>
          </button>

          {showColorPicker && (
            <div className="rich-editor__color-menu">
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>
                Text Color
              </div>
              <div className="rich-editor__color-grid">
                {TEMPLATE_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleApplyColor(c.hex)}
                    className="rich-editor__color-chip"
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary)', margin: '10px 0 6px', textTransform: 'uppercase' }}>
                Badge Highlight
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {TEMPLATE_COLORS.slice(0, 4).map(c => (
                  <button
                    key={'bg-' + c.name}
                    type="button"
                    onClick={() => handleApplyHighlight(c.bg, c.text)}
                    className="rich-editor__badge-opt"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {c.name} Pill
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rich-editor__divider" />

        {/* Lists & Quotes */}
        <div className="rich-editor__group">
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('insertUnorderedList')}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('formatBlock', '<blockquote>')}
            title="Quote Block"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={handleInsertLink}
            title="Insert Hyperlink"
          >
            <LinkIcon size={14} />
          </button>
        </div>

        <div className="rich-editor__divider" />

        {/* Templates & Snippets */}
        <div className="rich-editor__group" style={{ position: 'relative' }}>
          <button
            type="button"
            className="rich-editor__btn rich-editor__btn--snippet"
            onClick={() => setShowSnippets(!showSnippets)}
            title="Insert Pre-formatted Clinical Layout Snippets"
          >
            <Sparkles size={13} />
            <span>Templates</span>
          </button>

          {showSnippets && (
            <div className="rich-editor__snippet-menu">
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                Medical 360 Templates
              </div>
              {QUICK_SNIPPETS.map(snip => (
                <button
                  key={snip.label}
                  type="button"
                  className="rich-editor__snippet-item"
                  onClick={() => handleInsertSnippet(snip.html)}
                >
                  <CornerDownLeft size={12} color="var(--color-primary)" />
                  <span>{snip.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear & Copy Helpers */}
        <div className="rich-editor__group" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={() => executeCmd('removeFormat')}
            title="Clear Formatting"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            className="rich-editor__btn"
            onClick={handleCopyCode}
            title="Copy Raw HTML"
          >
            {copiedCode ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Editor Main Surface */}
      <div className="rich-editor__body" style={{ minHeight }}>
        {/* Visual Mode */}
        {activeTab === 'visual' && (
          <div
            ref={visualEditorRef}
            contentEditable
            className="rich-editor__content-area"
            onInput={handleVisualInput}
            onKeyDown={handleKeyDown}
            style={{ minHeight }}
            data-placeholder={placeholder}
          />
        )}

        {/* Raw HTML Code Area */}
        {activeTab === 'code' && (
          <div className="rich-editor__code-wrapper">
            <div className="rich-editor__code-bar">
              <span>HTML Source Code Mode (Paste or edit custom markup)</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{value.length} characters</span>
            </div>
            <textarea
              ref={textareaRef}
              className="rich-editor__textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<!-- Paste your custom HTML, embeds, or styled markup here -->"
              style={{ minHeight }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Preview Mode */}
        {activeTab === 'preview' && (
          <div className="rich-editor__preview-area" style={{ minHeight }}>
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />
            ) : (
              <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                No content entered yet. Switch to Visual Editor or HTML Code Area to add text.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="rich-editor__statusbar">
        <span>Mode: <strong style={{ color: 'var(--color-primary)' }}>{activeTab.toUpperCase()}</strong></span>
        <span>Supports Rich HTML, Colors, Badges & Snippets</span>
      </div>
    </div>
  );
}

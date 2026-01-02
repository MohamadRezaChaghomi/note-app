"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Bold, Italic, List, Code, Eye, EyeOff, X } from "lucide-react";
import "@/styles/components/notes.css";
export default function NoteEditor({ initial = {}, onSave, saving = false, readOnly = false }) {
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [tags, setTags] = useState(initial.tags || []);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [preview, setPreview] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setTitle(initial.title || "");
    setContent(initial.content || "");
    setTags(initial.tags || []);
  }, [initial]);

  useEffect(() => {
    // load all tags for selector
    let mounted = true;
    fetch('/api/tags')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (mounted) setAllTags(data.tags || []);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const scheduleSave = (patch) => {
    if (!onSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave(patch);
    }, 900);
  };

  useEffect(() => {
    // autosave title/content/tags diff
    const patch = {};
    if (title !== (initial.title || "")) patch.title = title;
    if (content !== (initial.content || "")) patch.content = content;
    if (JSON.stringify(tags) !== JSON.stringify(initial.tags || [])) patch.tags = tags;
    if (Object.keys(patch).length > 0) scheduleSave(patch);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags]);

  const handleAddTag = async () => {
    const t = newTag.trim();
    if (!t) return;
    if (!allTags.includes(t)) {
      try {
        const res = await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: t }) });
        if (res.ok) {
          const data = await res.json();
          setAllTags(prev => [...prev, data.tag.name]);
        }
      } catch (e) {}
    }
    if (!tags.includes(t)) setTags(prev => [...prev, t]);
    setNewTag("");
  };

  const handleRemoveTag = (t) => {
    setTags(prev => prev.filter(x => x !== t));
  };

  const handleFormat = (format) => {
    const textarea = document.querySelector('.note-editor-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    let newText = content;
    if (format === 'bold') newText = content.substring(0, start) + `**${selected}**` + content.substring(end);
    if (format === 'italic') newText = content.substring(0, start) + `*${selected}*` + content.substring(end);
    if (format === 'list') newText = content.substring(0, start) + `- ${selected}` + content.substring(end);
    if (format === 'code') newText = content.substring(0, start) + `\n\`\`\`\n${selected}\n\`\`\`\n` + content.substring(end);
    setContent(newText);
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start, start + newText.length); }, 0);
  };

  const manualSave = () => {
    const patch = { title, content, tags };
    if (onSave) onSave(patch);
  };

  return (
    <div className="note-editor">
      <div className="note-editor-head">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="note-editor-title"
          disabled={readOnly}
        />

        <div className="note-editor-actions">
          <div className="format-buttons">
            <button onClick={() => handleFormat('bold')} disabled={readOnly} title="Bold"><Bold className="w-4 h-4" /></button>
            <button onClick={() => handleFormat('italic')} disabled={readOnly} title="Italic"><Italic className="w-4 h-4" /></button>
            <button onClick={() => handleFormat('list')} disabled={readOnly} title="List"><List className="w-4 h-4" /></button>
            <button onClick={() => handleFormat('code')} disabled={readOnly} title="Code"><Code className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setPreview(p => !p)} className="preview-toggle" disabled={readOnly} title="Preview">{preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          <button onClick={manualSave} className="manual-save" disabled={saving || readOnly} title="Save"><Save className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="note-editor-body">
        {preview ? (
          <div className="note-preview">
            <h2>{title || 'Untitled'}</h2>
            <div className="preview-content">
              {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        ) : (
          <textarea
            className="note-editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            placeholder="Write your note..."
            disabled={readOnly}
          />
        )}

        <aside className="note-editor-sidebar">
          <div className="tags-block">
            <label className="tags-label">Tags</label>
            <div className="tags-list">
              {tags.map((t) => (
                <span key={t} className="tag-item">
                  #{t}
                  {!readOnly && <button onClick={() => handleRemoveTag(t)} title="Remove tag"><X className="w-3 h-3" /></button>}
                </span>
              ))}
            </div>

            {!readOnly && (
              <div className="add-tag-row">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} placeholder="New tag" />
                <button onClick={handleAddTag}>Add</button>
              </div>
            )}

            <div className="all-tags">
              {allTags.slice(0, 50).map((t) => (
                <button key={t} className={`all-tag ${tags.includes(t) ? 'selected' : ''}`} onClick={() => {
                  if (!readOnly) setTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);
                }}>{t}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

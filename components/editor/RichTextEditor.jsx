"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered,
  Heading, Quote, Code, Link, Image, 
  Save, Type, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import "@styles/components/notes/rich-text-editor.module.css";

export default function RichTextEditor({ value, onChange, readOnly = false, placeholder = "" }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command, value = null) => {
    if (readOnly) return;
    
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current.focus();
  };

  const insertLink = () => {
    if (readOnly) return;
    
    const url = prompt("Enter URL:");
    if (url) {
      formatText("createLink", url);
    }
  };

  const insertImage = () => {
    if (readOnly) return;
    
    const url = prompt("Enter image URL:");
    if (url) {
      formatText("insertImage", url);
    }
  };

  const toggleHeading = (level) => {
    if (readOnly) return;
    formatText("formatBlock", `<h${level}>`);
  };

  const clearFormatting = () => {
    if (readOnly) return;
    formatText("removeFormat");
  };

  return (
    <div className="rich-text-editor">
      {!readOnly && (
        <div className="toolbar">
          <div className="toolbar-group">
            <button 
              type="button" 
              onClick={() => formatText('bold')}
              className="toolbar-btn"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('italic')}
              className="toolbar-btn"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('underline')}
              className="toolbar-btn"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="toolbar-group">
            <button 
              type="button" 
              onClick={() => toggleHeading(1)}
              className="toolbar-btn"
              title="Heading 1"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">1</span>
            </button>
            <button 
              type="button" 
              onClick={() => toggleHeading(2)}
              className="toolbar-btn"
              title="Heading 2"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">2</span>
            </button>
            <button 
              type="button" 
              onClick={() => toggleHeading(3)}
              className="toolbar-btn"
              title="Heading 3"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">3</span>
            </button>
          </div>

          <div className="toolbar-group">
            <button 
              type="button" 
              onClick={() => formatText('insertUnorderedList')}
              className="toolbar-btn"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('insertOrderedList')}
              className="toolbar-btn"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('formatBlock', '<blockquote>')}
              className="toolbar-btn"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('formatBlock', '<pre>')}
              className="toolbar-btn"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="toolbar-group">
            <button 
              type="button" 
              onClick={insertLink}
              className="toolbar-btn"
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={insertImage}
              className="toolbar-btn"
              title="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          <div className="toolbar-group">
            <button 
              type="button" 
              onClick={() => formatText('justifyLeft')}
              className="toolbar-btn"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('justifyCenter')}
              className="toolbar-btn"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('justifyRight')}
              className="toolbar-btn"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="toolbar-group ml-auto">
            <button 
              type="button" 
              onClick={clearFormatting}
              className="toolbar-btn"
              title="Clear Formatting"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        className={`editor-content ${isFocused ? 'focused' : ''} ${readOnly ? 'read-only' : ''}`}
        contentEditable={!readOnly}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
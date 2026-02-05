"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered,
  Heading, Quote, Code, Link, Image, 
  Save, Type, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import styles from "@styles/components/notes/rich-text-editor.module.css";

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
    <div className={styles["rich-text-editor"]}>
      {!readOnly && (
        <div className={styles.toolbar}>
          <div className={styles["toolbar-group"]}>
            <button 
              type="button" 
              onClick={() => formatText('bold')}
              className={styles["toolbar-btn"]}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('italic')}
              className={styles["toolbar-btn"]}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('underline')}
              className={styles["toolbar-btn"]}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className={styles["toolbar-group"]}>
            <button 
              type="button" 
              onClick={() => toggleHeading(1)}
              className={styles["toolbar-btn"]}
              title="Heading 1"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">1</span>
            </button>
            <button 
              type="button" 
              onClick={() => toggleHeading(2)}
              className={styles["toolbar-btn"]}
              title="Heading 2"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">2</span>
            </button>
            <button 
              type="button" 
              onClick={() => toggleHeading(3)}
              className={styles["toolbar-btn"]}
              title="Heading 3"
            >
              <Heading className="w-4 h-4" />
              <span className="text-xs">3</span>
            </button>
          </div>

          <div className={styles["toolbar-group"]}>
            <button 
              type="button" 
              onClick={() => formatText('insertUnorderedList')}
              className={styles["toolbar-btn"]}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('insertOrderedList')}
              className={styles["toolbar-btn"]}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('formatBlock', '<blockquote>')}
              className={styles["toolbar-btn"]}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('formatBlock', '<pre>')}
              className={styles["toolbar-btn"]}
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className={styles["toolbar-group"]}>
            <button 
              type="button" 
              onClick={insertLink}
              className={styles["toolbar-btn"]}
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={insertImage}
              className={styles["toolbar-btn"]}
              title="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          <div className={styles["toolbar-group"]}>
            <button 
              type="button" 
              onClick={() => formatText('justifyLeft')}
              className={styles["toolbar-btn"]}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('justifyCenter')}
              className={styles["toolbar-btn"]}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => formatText('justifyRight')}
              className={styles["toolbar-btn"]}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className={`${styles["toolbar-group"]} ml-auto`}>
            <button 
              type="button" 
              onClick={clearFormatting}
              className={styles["toolbar-btn"]}
              title="Clear Formatting"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        className={`${styles["editor-content"]} ${isFocused ? styles.focused : ''} ${readOnly ? styles["read-only"] : ''}`}
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
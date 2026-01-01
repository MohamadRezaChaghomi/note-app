"use client";

import React from "react";

export default function ErrorModal({ open, title = "Error", message = "", onClose }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:60}}>
      <div style={{width:'min(680px,90%)',background:'var(--bg-light,white)',borderRadius:12,padding:24,boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button onClick={onClose} style={{border:'none',background:'transparent',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{marginBottom:16,color:'var(--text-primary,#111)'}}>
          {typeof message === 'string' ? <p style={{margin:0,lineHeight:1.5}}>{message}</p> : message}
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'8px 14px',borderRadius:8,border:'none',background:'var(--primary-color,#3b82f6)',color:'white',cursor:'pointer'}}>Close</button>
        </div>
      </div>
    </div>
  );
}

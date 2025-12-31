"use client";

export default function NoteCard({ note, onOpen, onToggleStar, onToggleArchive, onTrash }) {
  return (
    <div className="rounded-xl border p-4 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold truncate">{note.title}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            className="text-xs px-2 py-1 rounded border dark:border-gray-700"
            onClick={() => onToggleStar(note)}
            type="button"
          >
            {note.isStarred ? "★" : "☆"}
          </button>

          <button
            className="text-xs px-2 py-1 rounded border dark:border-gray-700"
            onClick={() => onToggleArchive(note)}
            type="button"
          >
            {note.isArchived ? "Unarchive" : "Archive"}
          </button>

          <button
            className="text-xs px-2 py-1 rounded border dark:border-gray-700"
            onClick={() => onTrash(note)}
            type="button"
          >
            Trash
          </button>

          <button
            className="text-xs px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black"
            onClick={() => onOpen(note)}
            type="button"
          >
            Open
          </button>
        </div>
      </div>

      {note.content ? (
        <p className="text-sm text-gray-700 dark:text-gray-200 mt-3 line-clamp-3">
          {note.content}
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-3">No content</p>
      )}
    </div>
  );
}

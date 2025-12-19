import mongoose, { Schema, models, model } from "mongoose";

const NoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: false,
      default: "quick",
    },
  },
  { timestamps: true }
);

const Note = models.Note || model("Note", NoteSchema);

export default Note;

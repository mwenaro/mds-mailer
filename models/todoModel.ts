import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema: Schema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export const TodoModel: Model<ITodo> = (mongoose.models.Todo as Model<ITodo>) || mongoose.model<ITodo>("Todo", TodoSchema);

export default TodoModel;
